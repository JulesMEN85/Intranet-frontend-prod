"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import axios from "axios";

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

const VoletPvcCard = ({ selectedWeek }) => {
  const [voletData, setVoletData] = useState([]);
  const [totalTemps, setTotalTemps] = useState(0);
  const [maxTempsParSemaine, setMaxTempsParSemaine] = useState(45); // Exemple : 45h max
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreCommandes, setNombreCommandes] = useState(0);
  const [totalVolets24mmLames, setTotalVolets24mmLames] = useState(0);
  const [totalVolets28mmLames, setTotalVolets28mmLames] = useState(0);
  const [postesData, setPostesData] = useState([]);
  const [tempsPersonneAssignee, setTempsPersonneAssignee] = useState("0h 0min");
  const [dataLoaded, setDataLoaded] = useState(false);

  const formattedWeek = selectedWeek.replace(/-W(\d)$/, "-W0$1"); // Assure le format YYYY-WXX



  const fetchData = async (startDate, endDate) => {
    try {
        if (!selectedWeek) {
            console.warn("⚠️ Impossible de récupérer les données : selectedWeek est undefined.");
            return;
        }

        // ✅ Correction du format de la semaine
        const formattedWeek = selectedWeek.replace(/-W(\d)$/, "-W0$1");


        const response = await fetch(
            `http://localhost:4000/api/systemes/volet?startDate=${startDate}&endDate=${endDate}&selectedWeek=${formattedWeek}`
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        setVoletData(data);

        let totalCommandes = data.length;
        let totalInSeconds = 0;

        let unique24mmLames = new Set();
        let unique28mmLames = new Set();

        data.forEach((item) => {
            if (!item.commande) return;

            if (item.systeme === "VOLET PVC 24 MM LAMES GO") {
                unique24mmLames.add(item.commande);
            } else if (item.systeme === "VOLET PVC 28 MM LAMES") {
                unique28mmLames.add(item.commande);
            }

            if (item.temps) {
                const timeParts = item.temps.split(":").map(Number);
                if (timeParts.length === 3 && !timeParts.some(isNaN)) {
                    const [hours, minutes, seconds] = timeParts;
                    totalInSeconds += hours * 3600 + minutes * 60 + seconds;
                }
            }
        });

        setTotalVolets24mmLames(unique24mmLames.size);
        setTotalVolets28mmLames(unique28mmLames.size);
        setNombreCommandes(totalCommandes);
        setTotalTemps(totalInSeconds);

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données Volet PVC :", error);
    }
};




const fetchPostes = async () => {
  try {
      if (!selectedWeek) {
          console.warn("⚠️ Impossible de récupérer les postes : selectedWeek est undefined.");
          return;
      }

      // ✅ Correction du format de la semaine (YYYY-WXX)
      const formattedWeek = selectedWeek.replace(/-W(\d)$/, "-W0$1");


      const response = await axios.get(`http://localhost:4000/api/systemes/postes-personnel?selectedWeek=${formattedWeek}`);

      if (!response.data || typeof response.data !== "object") {
          console.warn("🚨 Réponse inattendue pour les postes :", response.data);
          setMaxTempsParSemaine(null); // Assure que la valeur est bien remise à null
          return;
      }


      // ✅ Vérification si une personne est assignée au poste "MO_MEN_FINIT01"
      const poste = response.data.find(poste => poste.poste_code === "MO_MEN_FINIT01");

      if (poste) {
          let totalTempsEnSecondes = 0;

          // ✅ Calcul du temps total assigné
          const joursTravailles = [poste.lundi, poste.mardi, poste.mercredi, poste.jeudi, poste.vendredi]
              .filter(Boolean).length;
          const heuresParJour = 8;
          totalTempsEnSecondes = joursTravailles * heuresParJour * 3600;

          // ✅ Converti en HH:MM et met à jour l'affichage
          setMaxTempsParSemaine(convertToHoursAndMinutes(totalTempsEnSecondes));
      } else {
          // ✅ Aucune assignation => affiche le message "🛑 AUCUNE ASSIGNATION"
          console.warn("🚨 Aucune assignation trouvée pour MO_MEN_FINIT01.");
          setMaxTempsParSemaine(null);
      }
  } catch (error) {
      console.error("❌ Erreur lors de la récupération des postes :", error);
      setMaxTempsParSemaine(null);
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
  if (selectedWeek) {
      const { from, to } = getDateRangeFromWeek(selectedWeek);
      fetchData(from.toISOString().split("T")[0], to.toISOString().split("T")[0]);
  }
  fetchPostes();
}, [selectedWeek]);


  useEffect(() => {
    if (maxTempsParSemaine > 0) {
        const totalTempsInHours = totalTemps / 3600;
        const progressPercentage = ((totalTempsInHours / maxTempsParSemaine) * 100).toFixed(1);
        setProgress(progressPercentage);
    } else {
        setProgress(0);
    }
}, [totalTemps, maxTempsParSemaine]);

useEffect(() => {

  if (!maxTempsParSemaine || maxTempsParSemaine === "🛑 AUCUNE ASSIGNATION") {
      console.warn("⚠️ Aucune assignation, progression mise à 0 !");
      setProgress(0);
      return;
  }

  // ✅ Vérification et conversion en heures si nécessaire
  const maxTempsEnHeures = parseFloat(
      typeof maxTempsParSemaine === "string" ? maxTempsParSemaine.replace("h", "").trim() : maxTempsParSemaine
  );

  if (isNaN(maxTempsEnHeures) || maxTempsEnHeures <= 0) {
      console.warn("⚠️ maxTempsParSemaine invalide, progression mise à 0 !");
      setProgress(0);
      return;
  }

  // ✅ Conversion du totalTemps en heures
  const totalTempsInHours = totalTemps / 3600;

  // ✅ Calcul du pourcentage
  const progressPercentage = ((totalTempsInHours / maxTempsEnHeures) * 100).toFixed(1);

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
        <h2 className="text-2xl font-bold mb-2">Volet PVC</h2>
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

            <h3 className="text-xl font-bold mb-4">Détails des commandes Volet PVC</h3>

            {/* 🔹 Comptage des commandes avec système 24mm et 28mm */}
            {(() => {
              let total24mm = 0;
              let total28mm = 0;

              voletData.forEach((item) => {
                if (item.systeme === "VOLET PVC 24 MM LAMES GO") {
                  total24mm++;
                } else if (item.systeme === "VOLET PVC 28 MM LAMES") {
                  total28mm++;
                }
              });

              return (
                <div className="mb-4 p-4 bg-gray-100 rounded-md text-center shadow-sm">
                  <p className="text-lg font-semibold">
                    📌 Nombre de commandes "VOLET PVC 24 MM LAMES GO" :
                    <span className="text-blue-600"> {total24mm} </span>
                  </p>
                  <p className="text-lg font-semibold">
                    📌 Nombre de commandes "VOLET PVC 28 MM LAMES" :
                    <span className="text-red-600"> {total28mm} </span>
                  </p>
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

export default VoletPvcCard;
