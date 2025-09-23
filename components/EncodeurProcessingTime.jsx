'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import correct de useRouter
import { startOfWeek, endOfWeek, addWeeks, format, getISOWeek } from 'date-fns';
import { Button } from "@/components/ui/button";
import fr from 'date-fns/locale/fr';

const EncodeurProcessingTime = () => {
  const router = useRouter(); // Initialisation du router
  const [encodeurs, setEncodeurs] = useState([]);
  const [selectedEncodeur, setSelectedEncodeur] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [results, setResults] = useState([]);
  const [prevResults, setPrevResults] = useState([]);
  const [stats, setStats] = useState({ avgTVA: 0, avgHTVA: 0, avgTime: 0, totalCommands: 0 });
  const [prevStats, setPrevStats] = useState({ avgTVA: 0, avgHTVA: 0, avgTime: 0, totalCommands: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dates pour la semaine actuelle et précédente
  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const prevStartDate = startOfWeek(addWeeks(currentWeek, -1), { weekStartsOn: 1 });
  const prevEndDate = endOfWeek(addWeeks(currentWeek, -1), { weekStartsOn: 1 });

  const weekNumber = getISOWeek(currentWeek);

  const fetchEncodeurs = async () => {
    try {
      const response = await fetch('/api/encodeurs/list');
      if (!response.ok) throw new Error('Erreur lors de la récupération des encodeurs.');
      const data = await response.json();
      setEncodeurs(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchDataForRange = async (start, end, setter) => {
    if (!selectedEncodeur) return;
    try {
      const response = await fetch(
        `/api/encodeurs/processing-time?encodeur=${selectedEncodeur}&startDate=${format(
          start,
          'yyyy-MM-dd'
        )}&endDate=${format(end, 'yyyy-MM-dd')}`
      );
      if (!response.ok) throw new Error('Erreur lors de la récupération des temps de traitement.');
      const data = await response.json();
      setter(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateStats = (data) => {
    if (!data.length) return { avgTVA: 0, avgHTVA: 0, avgTime: 0, totalCommands: 0 };

    let totalTVA = 0;
    let totalHTVA = 0;
    let timeDifferences = [];

    data.forEach((row, index) => {
      totalTVA += row.tottvac || 0;
      totalHTVA += row.tothtva || 0;

      const currentDate = new Date(row.heure_debut);
      const nextRow = data[index + 1];
      const nextDate = nextRow ? new Date(nextRow.heure_debut) : null;

      if (
        currentDate &&
        nextDate &&
        currentDate.toDateString() === nextDate.toDateString()
      ) {
        let difference = (nextDate - currentDate) / 60000; // Différence en minutes
        if (!isNaN(difference) && difference > 0 && difference <= 60) {
          // Exclure les commandes de plus d'une heure
          timeDifferences.push(difference);
        }
      }
    });

    const avgTVA = totalTVA / data.length;
    const avgHTVA = totalHTVA / data.length;
    const avgTime =
      timeDifferences.length > 0
        ? timeDifferences.reduce((sum, val) => sum + val, 0) / timeDifferences.length
        : 0;

    return { avgTVA, avgHTVA, avgTime, totalCommands: data.length };
  };

  const calculateVariation = (current, previous) => {
    if (previous === 0) return 'N/A';
    const variation = ((current - previous) / previous) * 100;
    return variation.toFixed(2); // Renvoie un nombre avec 2 décimales
  };

  useEffect(() => {
    fetchEncodeurs();
  }, []);

  useEffect(() => {
    if (!selectedEncodeur) return;
    setLoading(true);
    fetchDataForRange(startDate, endDate, setResults);
    fetchDataForRange(prevStartDate, prevEndDate, setPrevResults);
    setLoading(false);
  }, [currentWeek, selectedEncodeur]);

  useEffect(() => {
    if (results.length) setStats(calculateStats(results));
    if (prevResults.length) setPrevStats(calculateStats(prevResults));
  }, [results, prevResults]);

  const handleRedirectToStats = () => {
    router.push("/encodeur/stats"); // Utilisation correcte de router
  };

  // Fonction pour formater les nombres avec des espaces
  const formatNumber = (num) => {
    return num.toLocaleString('fr-FR');
  };
  
  return (
    <main className="flex flex-col gap-6 p-6 bg-sky-950 min-h-screen">
        {/* Première carte */}
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-2">
                    <Button
                        className="bg-sky-950 text-white hover:bg-sky-900"
                        onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
                    >
                        &larr; Précédente
                    </Button>
                    <span className="text-lg font-bold text-gray-800">
                        Semaine {weekNumber}
                    </span>
                    <Button
                        className="bg-sky-950 text-white hover:bg-sky-900"
                        onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    >
                        Suivante &rarr;
                    </Button>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <select
                        value={selectedEncodeur}
                        onChange={(e) => setSelectedEncodeur(e.target.value)}
                        className="block w-64 p-2.5 border border-gray-300 rounded-md text-gray-600"
                    >
                        <option value="">-- Sélectionnez un encodeur --</option>
                        {encodeurs.map((enc) => (
                            <option key={enc.code} value={enc.code}>
                                {enc.code}
                            </option>
                        ))}
                    </select>
                </div>
                <Button
                    className="bg-sky-950 text-white hover:bg-sky-900"
                    onClick={handleRedirectToStats}
                >
                    Aller aux statistiques
                </Button>
            </div>
        </div>

        {/* Indicateurs Hebdomadaires */}
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Indicateurs Hebdomadaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-md shadow">
                    <h3 className="text-sm font-medium text-gray-500">Moyenne Total TVA</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {stats.avgTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </p>
                    <p
                        className={`text-sm ${
                            calculateVariation(stats.avgTVA, prevStats.avgTVA) > 0
                                ? 'text-green-500'
                                : 'text-red-500'
                        }`}
                    >
                        {calculateVariation(stats.avgTVA, prevStats.avgTVA)}%
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md shadow">
                    <h3 className="text-sm font-medium text-gray-500">Moyenne Total HTVA</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {stats.avgHTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </p>
                    <p
                        className={`text-sm ${
                            calculateVariation(stats.avgHTVA, prevStats.avgHTVA) > 0
                                ? 'text-green-500'
                                : 'text-red-500'
                        }`}
                    >
                        {calculateVariation(stats.avgHTVA, prevStats.avgHTVA)}%
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md shadow">
                    <h3 className="text-sm font-medium text-gray-500">Temps Moyen par Commande</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {stats.avgTime.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} min
                    </p>
                    <p
                        className={`text-sm ${
                            calculateVariation(stats.avgTime, prevStats.avgTime) > 0
                                ? 'text-green-500'
                                : 'text-red-500'
                        }`}
                    >
                        {calculateVariation(stats.avgTime, prevStats.avgTime)}%
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md shadow">
                    <h3 className="text-sm font-medium text-gray-500">Nombre de Commandes</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {stats.totalCommands.toLocaleString('fr-FR')}
                    </p>
                    <p
                        className={`text-sm ${
                            calculateVariation(stats.totalCommands, prevStats.totalCommands) > 0
                                ? 'text-green-500'
                                : 'text-red-500'
                        }`}
                    >
                        {calculateVariation(stats.totalCommands, prevStats.totalCommands)}%
                    </p>
                </div>
            </div>
        </div>

        {/* Tableau des résultats */}
        <div className="bg-white shadow rounded-lg p-6">
            {loading ? (
                <p className="text-center text-gray-600">Chargement...</p>
            ) : (
                <div className="overflow-x-auto">
                    {/* Limite la hauteur du tableau à 7 lignes */}
                    <div className="max-h-[calc(7*48px)] overflow-y-auto">
                        <table className="min-w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Commande
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Encodeur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Heure
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total TVA
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total HTVA
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {results.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition ease-in-out duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {row.commande}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {row.encodeur}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {row.heure_debut}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {row.tottvac.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {row.tothtva.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    </main>
);
};

export default EncodeurProcessingTime;
