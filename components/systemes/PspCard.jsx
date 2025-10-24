"use client";

import { baseURL } from '@/utils/baseURL';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ["#00C49F", "#EEE", "#FF6347", "#FFA500"];

const ProgressChart = ({ progressPercentage }) => {
  const uniqueId = `clip-${Math.random().toString(36).substr(2, 9)}`;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Active l'animation uniquement après le montage
  }, []);

  const data = [
    { name: "Progression", value: parseFloat(progressPercentage) },
    { name: "Reste", value: 100 - parseFloat(progressPercentage) },
  ];

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return COLORS[2];
    if (percentage >= 60) return COLORS[3];
    return COLORS[0];
  };

  return (
    <PieChart width={200} height={200}>
      <defs>
        <clipPath id={`clip-${uniqueId}`}>
          <rect x="0" y="0" width="200" height="200" />
        </clipPath>
      </defs>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        startAngle={90}
        endAngle={-270}
        dataKey="value"
        stroke="none"
        isAnimationActive={isClient} // Active l'animation uniquement côté client
        animationDuration={1500}
        animationEasing="ease-in-out"
        clipPath={`url(#clip-${uniqueId})`} // Associe le clipPath unique
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${uniqueId}-${index}`} // Clé unique
            fill={index === 0 ? getProgressColor(progressPercentage) : COLORS[1]}
            fillOpacity={entry.value > 0 ? 1 : 0.3}
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

const convertToHoursAndMinutes = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}min`;
};

const PsppCard = ({ selectedWeek }) => {
  const [psppData, setPsppData] = useState([]);
  const [postesPersonnel, setPostesPersonnel] = useState(null);
  const [totalTemps, setTotalTemps] = useState(0);
  const [maxTempsParSemaine, setMaxTempsParSemaine] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreCommandes, setNombreCommandes] = useState(0);

  const formatSelectedWeek = (week) => {
    return week.replace(/-W(\d)$/, "-W0$1"); // ✅ Corrige le format avec un zéro si besoin
  };
  
  const fetchPostesPersonnel = async () => {
    if (!selectedWeek || selectedWeek.trim() === "") {
      console.warn("⚠️ Aucune semaine sélectionnée, requête non envoyée.");
      return;
    }
  
    const formattedWeek = formatSelectedWeek(selectedWeek);
  
    try {
      const response = await fetch(
        `${baseURL}/api/systemes/postes-personnel?selectedWeek=${formattedWeek}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.message === "AUCUNE ASSIGNATION") {
        console.warn("🚨 Aucune assignation trouvée pour cette semaine.");
        setPostesPersonnel(null);
        setMaxTempsParSemaine(null);
      } else if (Array.isArray(data) && data.length > 0) {
        setPostesPersonnel(data);
      } else {
        console.error("❌ Données des postes personnel non valides :", data);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des postes personnel :", error);
    }
  };
  

  
  // Fonction pour récupérer les données PSPP
  const fetchData = async (startDate, endDate) => {
    try {
      const response = await fetch(
        `${baseURL}/api/systemes/psp?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setPsppData(data);
      setNombreCommandes(data.length);

      const totalInSeconds = data.reduce((acc, item) => {
        const [hours, minutes, seconds] = (item.temps || "0:0:0")
          .split(":")
          .map(Number);
        return acc + (hours * 3600 + minutes * 60 + seconds);
      }, 0);

      setTotalTemps(totalInSeconds);

      // Calcul des heures max par semaine en fonction des postes assignés
      if (data.length > 0) {
        const posteCode = data[0].code; // Supposons que le code du poste est dans "code"
        const posteAssigne = Array.isArray(postesPersonnel) ? postesPersonnel.find((p) => p.poste_code === posteCode) : null;

        if (posteAssigne) {
          const totalHeuresDisponibles = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"]
            .map((jour) => {
              const [hours, minutes, seconds] = posteAssigne[jour].split(':').map(Number);
              return hours + minutes / 60 + seconds / 3600;
            })
            .reduce((acc, heures) => acc + heures, 0);

          setMaxTempsParSemaine(totalHeuresDisponibles);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données PSP:", error);
    }
  };

  // Fonction pour obtenir la plage de dates à partir de la semaine sélectionnée
  const getDateRangeFromWeek = (weekString) => {
    const [year, weekPart] = weekString.split("-W");
    const week = parseInt(weekPart, 10);
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;

    const startDate = new Date(firstDayOfYear);
    startDate.setDate(firstDayOfYear.getDate() + daysOffset - ((firstDayOfYear.getDay() + 6) % 7));

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return { from: startDate, to: endDate };
  };

  

// 1️⃣ Log pour suivre les changements de `selectedWeek`
useEffect(() => {
  console.log("🔄 selectedWeek a changé :", selectedWeek);
}, [selectedWeek]);

// 2️⃣ Vérification et récupération des postes du personnel au montage du composant
useEffect(() => {
  if (!selectedWeek || typeof selectedWeek !== "string" || selectedWeek.trim() === "") {
    console.warn("⚠️ selectedWeek est vide ou invalide, requête annulée.");
    return;
  }

  fetchPostesPersonnel();
}, [selectedWeek]);

// 3️⃣ Récupération des données PSPP lorsque `selectedWeek` est valide
useEffect(() => {
  if (!selectedWeek || typeof selectedWeek !== "string" || selectedWeek.trim() === "") {
    console.warn("⚠️ Impossible de récupérer les données PSPP, selectedWeek invalide.");
    return;
  }

  const { from, to } = getDateRangeFromWeek(selectedWeek);
  fetchData(from.toISOString().split("T")[0], to.toISOString().split("T")[0]);
}, [selectedWeek]); // ❌ Suppression de `postesPersonnel` pour éviter la boucle infinie

// 4️⃣ Calcul de la progression en fonction du temps total et du temps max par semaine
useEffect(() => {
  if (maxTempsParSemaine === null || totalTemps === null) {
    console.warn("⚠️ Données incomplètes pour calculer la progression.");
    return;
  }

  const totalTempsInHours = totalTemps / 3600;
  const progressPercentage = maxTempsParSemaine
    ? ((totalTempsInHours / maxTempsParSemaine) * 100).toFixed(1)
    : 0;

  console.log("📊 Mise à jour de la progression :", progressPercentage);
  setProgress(progressPercentage);
}, [totalTemps, maxTempsParSemaine]);  

  return (
    <>
      <div
        className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center cursor-pointer
                    hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-out
                    min-w-[320px] min-h-[220px] relative hover:ring-4 hover:ring-blue-300/50"
        onClick={() => setIsModalOpen(true)}
      >
        <h2 className="text-2xl font-bold mb-2">PSP</h2>
        <p className="font-semibold">
          Temps total saisi : {convertToHoursAndMinutes(totalTemps)}
        </p>
        <p className="font-semibold">
          {maxTempsParSemaine === null ? "🛑 AUCUNE ASSIGNATION" : `Max par semaine : ${maxTempsParSemaine}h`}
        </p>
        <ProgressChart progressPercentage={progress} />
        <p className="mt-2 text-center">Progression : {progress}%</p>
        <p className="mt-1 text-center font-semibold">Nombre de Portes : {nombreCommandes}</p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-out animate-fade-in z-[1000]">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full transform transition-transform duration-500 ease-out animate-zoom-in min-h-[320px] z-[1010]">
            <h3 className="text-xl font-bold mb-4">Détails des commandes PSP</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
              {psppData.length > 0 ? (
                psppData.map((item, index) => (
                  <li key={index} className="border p-4 rounded-md shadow-sm bg-gray-50">
                    <p><strong>Commande :</strong> {item.commande}</p>
                    <p><strong>Description :</strong> {item.descriptio}</p>
                    <p><strong>Temps :</strong> {convertToHoursAndMinutes(
                      (item.temps || "0:0:0")
                        .split(":")
                        .reduce((acc, time, i) => acc + (i === 0 ? +time * 3600 : i === 1 ? +time * 60 : +time), 0)
                    )}
                    </p>
                  </li>
                ))
              ) : (
                <p>Aucune donnée disponible pour cette semaine.</p>
              )}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform duration-300 ease-in-out hover:scale-105"
              onClick={() => setIsModalOpen(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PsppCard;
