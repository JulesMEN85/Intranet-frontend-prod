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
    { name: "Progression", value: parseFloat(progressPercentage) || 0 },
    { name: "Reste", value: 100 - parseFloat(progressPercentage) || 100 },
  ];

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return COLORS[2]; // Rouge si >= 80%
    if (percentage >= 60) return COLORS[3]; // Orange si >= 60%
    return COLORS[0]; // Vert sinon
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
          <Cell
            key={`cell-${index}`}
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
  if (isNaN(seconds) || seconds <= 0) return "0h 0min";
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}min`;
};

const fetchPostesDisponibles = async (setMaxTempsParSemaine, setTempsPersonneAssignee, selectedWeek) => {
  try {
    if (!selectedWeek || !/^(\d{4})-W(\d{2})$/.test(selectedWeek)) {
      console.warn("⚠️ selectedWeek est invalide ou non défini :", selectedWeek);
      setMaxTempsParSemaine(null);
      return;
    }



    const formattedWeek = selectedWeek.replace(/-W(\d)$/, "-W0$1"); // Format YY-WXX


    const apiUrl = `http://192.168.1.18:4000/api/systemes/postes-personnel?selectedWeek=${formattedWeek}`;


    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur API (${response.status}): ${errorText}`);
      setMaxTempsParSemaine(null);
      return;
    }

    const data = await response.json();


    if (!data || typeof data !== "object") {
      console.warn("🚨 Réponse inattendue :", data);
      setMaxTempsParSemaine(null);
      return;
    }

    const poste = data.find(p => p.poste_code === "MO_MEN_FINIT04");

    if (poste) {
      const joursTravailles = [poste.lundi, poste.mardi, poste.mercredi, poste.jeudi, poste.vendredi].filter(Boolean).length;
      const totalTempsEnSecondes = joursTravailles * 8 * 3600;

      setMaxTempsParSemaine(convertToHoursAndMinutes(totalTempsEnSecondes));

    } else {
      console.warn("🚨 Aucune assignation trouvée.");
      setMaxTempsParSemaine(null);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des postes :", error);
    setMaxTempsParSemaine(null);
  }
};







const VoletAluCard = ({ selectedWeek }) => {
  const [voletData, setVoletData] = useState([]);
  const [totalTemps, setTotalTemps] = useState(0);
  const [maxTempsParSemaine, setMaxTempsParSemaine] = useState(45); // Exemple : 45h max
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreCommandes, setNombreCommandes] = useState(0);
  const [tempsPersonneAssignee, setTempsPersonneAssignee] = useState("0h 0min");

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await fetch(
        `http://192.168.1.18:4000/api/systemes/voletalu?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setVoletData(data);

      let totalCommandes = data.length;
      let totalInSeconds = 0;

      data.forEach((item) => {
        if (item.temps && item.quantite) {
          const timeParts = item.temps.split(":").map(Number);

          let hours = 0, minutes = 0, seconds = 0;

          // Si on reçoit un format hh:mm:ss
          if (timeParts.length === 3) {
            [hours, minutes, seconds] = timeParts;
          }
          // Si on reçoit un format mm:ss (sans heure)
          else if (timeParts.length === 2) {
            [minutes, seconds] = timeParts;
          }
          // Si on reçoit juste des secondes
          else if (timeParts.length === 1) {
            [seconds] = timeParts;
          }

          // Conversion du temps en secondes
          let tempsEnSecondes = (hours * 3600) + (minutes * 60) + seconds;

          // Multiplication par la quantité
          let tempsTotal = tempsEnSecondes * item.quantite;

          totalInSeconds += tempsTotal;
        }
      });

      setNombreCommandes(totalCommandes);
      setTotalTemps(totalInSeconds);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des données Volet ALU :", error);
    }
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

  useEffect(() => {
    fetchPostesDisponibles(setMaxTempsParSemaine, setTempsPersonneAssignee);
  }, []);

  useEffect(() => {
    if (selectedWeek) {
      const { from, to } = getDateRangeFromWeek(selectedWeek);
      fetchData(from.toISOString().split("T")[0], to.toISOString().split("T")[0]);
    }
  }, [selectedWeek]);

  useEffect(() => {
    if (selectedWeek) {
      fetchPostesDisponibles(setMaxTempsParSemaine, setTempsPersonneAssignee, selectedWeek);
    } else {
      console.warn("⚠️ selectedWeek est undefined au moment de l'appel !");
    }
  }, [selectedWeek]);
  
  

  useEffect(() => {
    if (maxTempsParSemaine && maxTempsParSemaine !== "🛑 AUCUNE ASSIGNATION") {
      // Vérifier si c'est un nombre avant d'utiliser split
      const maxTempsEnHeures = typeof maxTempsParSemaine === "string"
        ? parseFloat(maxTempsParSemaine.split("h")[0]) || 0
        : parseFloat(maxTempsParSemaine) || 0;
  
      const totalTempsInHours = totalTemps / 3600; // Conversion des secondes en heures
  
      let progressPercentage = ((totalTempsInHours / maxTempsEnHeures) * 100).toFixed(1);
  
      // Assurer que la progression est entre 0 et 100%
      progressPercentage = Math.max(0, Math.min(progressPercentage, 100));
  
  
      setProgress(progressPercentage);
    } else {
      setProgress(0);
    }
  }, [totalTemps, maxTempsParSemaine]);
  
  

  return (
    <>
      <div
        className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center cursor-pointer
                    hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-out
                    min-w-[320px] min-h-[220px] relative hover:ring-4 hover:ring-blue-300/50"
        onClick={() => setIsModalOpen(true)}
      >
        <h2 className="text-2xl font-bold mb-2">Volet ALU</h2>
        <p className="font-semibold">
          Temps total saisi : {convertToHoursAndMinutes(totalTemps)}
        </p>
        <p className="font-semibold">
          {maxTempsParSemaine === null ? "🛑 AUCUNE ASSIGNATION" : `Max par semaine : ${maxTempsParSemaine}`}
        </p>
        <ProgressChart progressPercentage={progress} />
        <p className="mt-2 text-center">Progression : {progress}%</p>
        <p className="mt-1 text-center font-semibold">Nombre de Commandes : {nombreCommandes}</p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-out animate-fade-in z-[1000]">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full transform transition-transform duration-500 ease-out animate-zoom-in min-h-[320px] z-[1010]">
            <h3 className="text-xl font-bold mb-4">Détails des commandes Volet ALU</h3>

            {(() => {
              const commandesUniques = new Set(voletData.map(item => item.commande));
              const commandesParSysteme = voletData.reduce((acc, item) => {
                if (!acc[item.systeme]) {
                  acc[item.systeme] = [];
                }
                acc[item.systeme].push(item);
                return acc;
              }, {});

              return (
                <div className="mb-4 p-4 bg-gray-100 rounded-md text-center shadow-sm">
                  {Object.entries(commandesParSysteme).map(([systeme, commandes]) => (
                    <div key={systeme} className="mb-2">
                        <p className="text-lg font-semibold">
                        📌 Nombre de commandes {"\"" + systeme + "\""} :
                        <span className="text-blue-600"> {commandes.length} </span>
                        </p>
                    </div>
                  ))}
                </div>
              );
            })()}

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
              {voletData.length > 0 ? (
                voletData.map((item, index) => (
                  <li key={index} className="border p-4 rounded-md shadow-sm bg-gray-50">
                    <p><strong>Commande :</strong> {item.commande}</p>
                    <p><strong>Description :</strong> {item.descriptio}</p>
                    <p><strong>Système :</strong> {item.systeme}</p>
                    <p><strong>Quantité :</strong> {item.quantite}</p>
                  </li>
                ))
              ) : (
                <p>Aucune donnée disponible pour cette semaine.</p>
              )}
            </ul>

            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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

export default VoletAluCard;
