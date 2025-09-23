"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#00C49F", "#EEE", "#FF6347", "#FFA500"];

const ProgressChart = ({ progressPercentage }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
        isAnimationActive={isClient}
        animationDuration={1500}
        animationEasing="ease-in-out"
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={index === 0 ? getProgressColor(progressPercentage) : COLORS[1]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

const convertToHoursAndMinutes = (seconds) => {
  if (!seconds || isNaN(seconds)) {
    return "0h 0min";
  }
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
};

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

const PVC38Card = ({ selectedWeek }) => {
  const [pvc38Data, setPVC38Data] = useState([]);
  const [postesPersonnel, setPostesPersonnel] = useState(null);
  const [totalTemps, setTotalTemps] = useState(0);
  const [maxTempsParSemaine, setMaxTempsParSemaine] = useState(null);
  const [progress, setProgress] = useState(0);
  const [nombreCommandes, setNombreCommandes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPostesPersonnel = async () => {
    if (!selectedWeek) return;
  
    try {
      const response = await fetch(`http://localhost:4000/api/systemes/postes-personnel?selectedWeek=${selectedWeek}`);
      if (!response.ok) throw new Error(`Erreur HTTP! Statut : ${response.status}`);
  
      const data = await response.json();
  
      if (data.message === "AUCUNE ASSIGNATION") {
        setPostesPersonnel(null);
        setMaxTempsParSemaine(null);
        return;
      }
  
      // 🔎 Recherche du poste spécifique MO_MEN_FINIT03
      const personne = data.find(item => item.poste_code === "MO_MEN_FINIT03");
      if (!personne) {
        setPostesPersonnel(null);
        setMaxTempsParSemaine(null);
        return;
      }
  
      // 🔄 Calcul du temps total pour la semaine
      let totalSeconds = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"]
        .map((jour) => {
          const [h, m, s] = (personne[jour] || "00:00:00").split(":").map(Number);
          return h * 3600 + m * 60 + s;
        })
        .reduce((acc, seconds) => acc + seconds, 0);
  
      setMaxTempsParSemaine(totalSeconds / 3600); // Converti en heures
      setPostesPersonnel(personne);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des postes personnels :", error);
    }
  };
  

  const fetchPVC38Data = async (startDate, endDate) => {
    try {
      const response = await fetch(`http://localhost:4000/api/systemes/pvc38?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error(`Erreur HTTP! Statut : ${response.status}`);

      const data = await response.json();
      setPVC38Data(data);
      setNombreCommandes(data.length);

      const totalInSeconds = data.reduce((acc, item) => {
        const [h, m, s] = (item.temps || "00:00:00").split(":").map(Number);
        return acc + (h * 3600 + m * 60 + s);
      }, 0);

      setTotalTemps(totalInSeconds);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des données PVC38 :", error);
    }
  };

  useEffect(() => {
    if (selectedWeek) {
      const { from, to } = getDateRangeFromWeek(selectedWeek);
      fetchPVC38Data(from.toISOString().split("T")[0], to.toISOString().split("T")[0]);
      fetchPostesPersonnel();
    }
  }, [selectedWeek]);
  
  useEffect(() => {
    setProgress(maxTempsParSemaine ? ((totalTemps / 3600 / maxTempsParSemaine) * 100).toFixed(1) : 0);
  }, [totalTemps, maxTempsParSemaine]);

  return (
    <>
      <div
        className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-out min-w-[320px] min-h-[220px] relative hover:ring-4 hover:ring-blue-300/50"
        onClick={() => setIsModalOpen(true)}
      >
        <h2 className="text-2xl font-bold mb-2">PVC38</h2>
        <p className="font-semibold">Temps total saisi : {convertToHoursAndMinutes(totalTemps)}</p>
        <p className="font-semibold">{maxTempsParSemaine ? `Max par semaine : ${maxTempsParSemaine.toFixed(1)}h` : "🛑 AUCUNE ASSIGNATION"}</p>
        <ProgressChart progressPercentage={progress} />
        <p className="mt-2 text-center">Progression : {progress}%</p>
        <p className="mt-1 text-center font-semibold">Nombre de Commandes : {nombreCommandes}</p>
      </div>
  
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-out animate-fade-in z-[1000]">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full transform transition-transform duration-500 ease-out animate-zoom-in min-h-[320px] z-[1010]">
            <h3 className="text-xl font-bold mb-4">Détails des commandes PVC38</h3>
  
            {/* Affichage du nombre de commandes par système */}
            {(() => {
              let systemeCounts = {};
              pvc38Data.forEach((item) => {
                if (item.systeme) {
                  systemeCounts[item.systeme] = (systemeCounts[item.systeme] || 0) + 1;
                }
              });
  
              return (
                <div className="mb-4 p-4 bg-gray-100 rounded-md text-center shadow-sm">
                  {Object.entries(systemeCounts).map(([systeme, count], index) => (
                    <p key={index} className="text-lg font-semibold">
                      📌 Nombre de commandes "{systeme}" :
                      <span className="text-blue-600"> {count} </span>
                    </p>
                  ))}
                </div>
              );
            })()}
  
            {/* Liste des commandes détaillées */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
              {pvc38Data.length > 0 ? (
                pvc38Data.map((item, index) => (
                  <li key={index} className="border p-4 rounded-md shadow-sm bg-gray-50">
                    <p><strong>Commande :</strong> {item.commande}</p>
                    <p><strong>Description :</strong> {item.descriptio}</p>
                    <p><strong>Système :</strong> {item.systeme}</p>
                    <p><strong>Temps :</strong> {convertToHoursAndMinutes(
                      (item.temps || "00:00:00").split(":").reduce((acc, time, i) => 
                        acc + (i === 0 ? +time * 3600 : i === 1 ? +time * 60 : +time), 0)
                    )}</p>
                  </li>
                ))
              ) : (
                <p>Aucune donnée disponible pour cette semaine.</p>
              )}
            </ul>
  
            {/* Bouton de fermeture */}
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

export default PVC38Card;
