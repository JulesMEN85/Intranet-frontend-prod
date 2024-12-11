import React, { useState, useEffect } from "react";
import { startOfWeek, endOfWeek, addWeeks, format, getISOWeek } from "date-fns";
import Link from "next/link"; // Import de Link pour la navigation

// Fonction utilitaire pour formater les nombres avec des espaces pour les milliers
const formatNumber = (number) => {
  return new Intl.NumberFormat("fr-FR").format(number);
};

// Fonction pour convertir les données en CSV
const exportToCSV = (data, filename) => {
  const rows = [
    // En-têtes des colonnes
    ["Statistiques", "Commandes Hebdo", "Commandes C", "Commandes SAV", "Articles"],
    // Lignes des données
    ["Total Commandes", data.weeklyData.totalCommands, data.cCommandsData.totalCommands, data.savCommandsData.totalCommands, data.articlesData.totalCommands],
    ["Total TVA", data.weeklyData.totalTVA, data.cCommandsData.totalTVA, data.savCommandsData.totalTVA, data.articlesData.totalTVA],
    ["Total HTVA", data.weeklyData.totalHTVA, data.cCommandsData.totalHTVA, data.savCommandsData.totalHTVA, data.articlesData.totalHTVA],
  ];

  // Générer le contenu CSV avec des points-virgules comme séparateur
  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((row) => row.join(";")).join("\n");

  // Télécharger le fichier CSV
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};






const StatsEncodeur = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weeklyData, setWeeklyData] = useState({ totalCommands: 0, avgTVA: 0, avgHTVA: 0 });
  const [cCommandsData, setCCommandsData] = useState({ totalCommands: 0, totalTVA: 0, totalHTVA: 0 });
  const [savCommandsData, setSavCommandsData] = useState({ totalCommands: 0, totalTVA: 0, totalHTVA: 0 });
  const [articlesData, setArticlesData] = useState({ totalCommands: 0, totalTVA: 0, totalHTVA: 0 });
  const [previousWeekData, setPreviousWeekData] = useState({ totalCommands: 0, avgTVA: 0, avgHTVA: 0 });
  const [previousCCommandsData, setPreviousCCommandsData] = useState({ totalCommands: 0, totalTVA: 0, totalHTVA: 0 });
  const [previousSAVCommandsData, setPreviousSAVCommandsData] = useState({totalCommands: 0,totalTVA: 0,totalHTVA: 0,});  
  const [previousArticlesData, setPreviousArticlesData] = useState({ totalCommands: 0, totalTVA: 0, totalHTVA: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeeklyProcessingTime = async (startDate, endDate) => {
    try {
      const response = await fetch(
        `/api/encodeurs/weekly-processing-time?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) throw new Error("Erreur lors de la récupération des données hebdomadaires.");
      const data = await response.json();
      return {
        totalCommands: data.commandes.length,
        totalTVA: data.totalTVA, // Utilisation des totaux
        totalHTVA: data.totalHTVA,
      };
    } catch (err) {
      console.error(err.message);
      setError("Erreur lors de la récupération des données.");
      return { totalCommands: 0, totalTVA: 0, totalHTVA: 0 };
    }
  };
  

  const fetchProcessingTimeForCCommands = async (startDate, endDate) => {
    const url = `/api/encodeurs/c-commands-processing-time?startDate=${startDate}&endDate=${endDate}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
      console.log('Données reçues pour Commandes C:', data); // Ajoutez ce log
      return data;
    } catch (error) {
      console.error('Erreur dans fetchProcessingTimeForCCommands:', error.message);
      return { totalCommands: 0, totalTVA: 0, totalHTVA: 0 }; // Valeurs par défaut
    }
  };
  
  
  

  const fetchProcessingTimeForSAVCommands = async (startDate, endDate) => {
    try {
      const response = await fetch(
        `/api/encodeurs/sav-commands-processing-time?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) throw new Error("Erreur lors de la récupération des données pour les commandes SAV.");
      const data = await response.json();
      return {
        totalCommands: data.totalCommands || 0,
        totalTVA: data.totalTVA || 0,
        totalHTVA: data.totalHTVA || 0,
      };
    } catch (err) {
      console.error(err.message);
      return { totalCommands: 0, totalTVA: 0, totalHTVA: 0 };
    }
  };
  

  const fetchProcessingTimeForArticles = async (startDate, endDate) => {
    try {
      const response = await fetch(
        `/api/encodeurs/access-commands-processing-time?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) throw new Error("Erreur lors de la récupération des données pour les Articles.");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
      return { totalCommands: 0, totalTVA: 0, totalHTVA: 0 }; // Utilisation de `totalTVA` et `totalHTVA`
    }
  };
  

  const calculateVariation = (current, previous) => {
    if (!previous || previous === 0) {
      return "0%"; // Pas de variation possible
    }
    const variation = ((current - previous) / previous) * 100;
    return `${variation.toFixed(2)}%`;
  };
  

  useEffect(() => {
    setStartDate(startOfWeek(currentWeek, { weekStartsOn: 1 }));
    setEndDate(endOfWeek(currentWeek, { weekStartsOn: 1 }));
  }, [currentWeek]); // Ajout de `currentWeek` dans les dépendances  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const currentStartDate = format(startDate, "yyyy-MM-dd");
      const currentEndDate = format(endDate, "yyyy-MM-dd");
      const previousStartDate = format(startOfWeek(addWeeks(currentWeek, -1), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const previousEndDate = format(endOfWeek(addWeeks(currentWeek, -1), { weekStartsOn: 1 }), "yyyy-MM-dd");

      const weekly = await fetchWeeklyProcessingTime(currentStartDate, currentEndDate);
      const prevWeekly = await fetchWeeklyProcessingTime(previousStartDate, previousEndDate);

      const cCommands = await fetchProcessingTimeForCCommands(currentStartDate, currentEndDate);
      const prevCCommands = await fetchProcessingTimeForCCommands(previousStartDate, previousEndDate);

      const savCommands = await fetchProcessingTimeForSAVCommands(currentStartDate, currentEndDate);
      const prevSAVCommands = await fetchProcessingTimeForSAVCommands(previousStartDate, previousEndDate);

      const articles = await fetchProcessingTimeForArticles(currentStartDate, currentEndDate);
      const prevArticles = await fetchProcessingTimeForArticles(previousStartDate, previousEndDate);

      setWeeklyData(weekly);
      setPreviousWeekData(prevWeekly);

      setCCommandsData(cCommands);
      setPreviousCCommandsData(prevCCommands);

      setSavCommandsData(savCommands);
      setPreviousSAVCommandsData(prevSAVCommands);

      setArticlesData(articles);
      setPreviousArticlesData(prevArticles);

      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate]);

  return (
  <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
    {/* Navigation */}
    <div className="flex items-center justify-between">
      {/* Bouton à gauche */}
      <Link
        href="/encodeur"
        className="bg-sky-950 text-white px-4 py-2 rounded hover:bg-sky-900"
      >
        Retour
      </Link>

      {/* Contenu centré */}
      <div className="flex items-center justify-center space-x-4">
        <button
          className="bg-sky-950 text-white px-4 py-2 rounded hover:bg-sky-900"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
        >
          &larr; Précédente
        </button>
        <span className="text-lg font-bold text-gray-800">
          Semaine {getISOWeek(currentWeek)} ({format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")})
        </span>
        <button
          className="bg-sky-950 text-white px-4 py-2 rounded hover:bg-sky-900"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          Suivante &rarr;
        </button>
      </div>

      {/* Bouton Exporter en CSV */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
        onClick={() =>
          exportToCSV(
            { weeklyData, cCommandsData, savCommandsData, articlesData },
            `stats_semaine_${getISOWeek(currentWeek)}.csv`
          )
        }
      >
        Exporter en CSV
      </button>
    </div>
  
        {/* Statistiques globales */}
        <div className="bg-gray-50 p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistiques globales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre total de commandes</h3>
              <p className="text-2xl font-bold">{formatNumber(weeklyData.totalCommands)}</p>
              <p
                className={`text-sm ${
                  calculateVariation(weeklyData.totalCommands, previousWeekData.totalCommands).includes("-")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {calculateVariation(weeklyData.totalCommands, previousWeekData.totalCommands)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total TVA globale</h3>
              <p className="text-2xl font-bold">{formatNumber(weeklyData.totalTVA)} €</p>
              <p
                className={`text-sm ${
                  calculateVariation(weeklyData.totalTVA, previousWeekData.totalTVA).includes("-")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {calculateVariation(weeklyData.totalTVA, previousWeekData.totalTVA)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total HTVA globale</h3>
              <p className="text-2xl font-bold">{formatNumber(weeklyData.totalHTVA)} €</p>
              <p
                className={`text-sm ${
                  calculateVariation(weeklyData.totalHTVA, previousWeekData.totalHTVA).includes("-")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {calculateVariation(weeklyData.totalHTVA, previousWeekData.totalHTVA)}
              </p>
            </div>
          </div>
        </div>

  
        {/* Statistiques commandes C */}
        <div className="bg-gray-50 p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Commandes C</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre total de commandes C</h3>
              <p className="text-2xl font-bold">{formatNumber(cCommandsData.totalCommands)}</p>
              <p
                className={`text-sm ${
                  calculateVariation(cCommandsData.totalCommands, previousCCommandsData.totalCommands).includes("-")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {calculateVariation(cCommandsData.totalCommands, previousCCommandsData.totalCommands)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total TVA des commandes C</h3>
              <p className="text-2xl font-bold">{formatNumber(cCommandsData.totalTVA)} €</p>
              <p
                className={`text-sm ${
                  calculateVariation(cCommandsData.totalTVA, previousCCommandsData.totalTVA).includes("-")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {calculateVariation(cCommandsData.totalTVA, previousCCommandsData.totalTVA)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total HTVA des commandes C</h3>
              <p className="text-2xl font-bold">{formatNumber(cCommandsData.totalHTVA)} €</p>
              <p
                className={`text-sm ${
                  calculateVariation(cCommandsData.totalHTVA, previousCCommandsData.totalHTVA).includes("-")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {calculateVariation(cCommandsData.totalHTVA, previousCCommandsData.totalHTVA)}
              </p>
            </div>
          </div>
        </div>


  
      {/* Statistiques commandes SAV */}
      <div className="bg-gray-50 p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Commandes SAV</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nombre total de commandes SAV</h3>
            <p className="text-2xl font-bold">{formatNumber(savCommandsData.totalCommands)}</p>
            <p
              className={`text-sm ${
                calculateVariation(savCommandsData.totalCommands, previousSAVCommandsData.totalCommands).includes("-")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {calculateVariation(savCommandsData.totalCommands, previousSAVCommandsData.totalCommands)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total TVA des commandes SAV</h3>
            <p className="text-2xl font-bold">{formatNumber(savCommandsData.totalTVA)} €</p>
            <p
              className={`text-sm ${
                calculateVariation(savCommandsData.totalTVA, previousSAVCommandsData.totalTVA).includes("-")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {calculateVariation(savCommandsData.totalTVA, previousSAVCommandsData.totalTVA)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total HTVA des commandes SAV</h3>
            <p className="text-2xl font-bold">{formatNumber(savCommandsData.totalHTVA)} €</p>
            <p
              className={`text-sm ${
                calculateVariation(savCommandsData.totalHTVA, previousSAVCommandsData.totalHTVA).includes("-")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {calculateVariation(savCommandsData.totalHTVA, previousSAVCommandsData.totalHTVA)}
            </p>
          </div>
        </div>
      </div>

  
      {/* Statistiques Articles */}
      <div className="bg-gray-50 p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistiques des Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
          <h3 className="text-sm font-medium text-gray-500">Nombre total d&apos;Articles</h3>
            <p className="text-2xl font-bold">{formatNumber(articlesData.totalCommands)}</p>
            <p
              className={`text-sm ${
                calculateVariation(articlesData.totalCommands, previousArticlesData.totalCommands).includes("-")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {calculateVariation(articlesData.totalCommands, previousArticlesData.totalCommands)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total TVA des Articles</h3>
            <p className="text-2xl font-bold">{formatNumber(articlesData.totalTVA)} €</p>
            <p
              className={`text-sm ${
                calculateVariation(articlesData.totalTVA, previousArticlesData.totalTVA).includes("-")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {calculateVariation(articlesData.totalTVA, previousArticlesData.totalTVA)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total HTVA des Articles</h3>
            <p className="text-2xl font-bold">{formatNumber(articlesData.totalHTVA)} €</p>
            <p
              className={`text-sm ${
                calculateVariation(articlesData.totalHTVA, previousArticlesData.totalHTVA).includes("-")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {calculateVariation(articlesData.totalHTVA, previousArticlesData.totalHTVA)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );  
};


export default StatsEncodeur;
