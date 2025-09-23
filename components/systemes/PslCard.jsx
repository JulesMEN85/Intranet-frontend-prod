import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#00C49F", "#EEE", "#FF6347", "#FFA500"];

const ProgressChart = ({ progressPercentage }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Active l'animation uniquement après le montage
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
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}min`;
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

const PslCard = ({ selectedWeek, maxTempsParSemaine, setMaxTempsParSemaine, totalTempsCumule, setTotalTempsCumule }) => {
  const [pslData, setPslData] = useState([]);
  const [postesPersonnel, setPostesPersonnel] = useState([]);
  const [totalTemps, setTotalTemps] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreCommandes, setNombreCommandes] = useState(0);

  const formatSelectedWeek = (week) => {
    return week.replace(/-W(\d)$/, "-W0$1"); // Ajoute un zéro si une seule lettre après W
  };
  
  const fetchPostesPersonnel = async () => {
    if (!selectedWeek || selectedWeek.trim() === "") {
        console.warn("⚠️ Aucune semaine sélectionnée, requête non envoyée.");
        return;
    }

    const formattedWeek = formatSelectedWeek(selectedWeek);


    try {
        const response = await fetch(`http://192.168.1.18:4000/api/systemes/postes-personnel?selectedWeek=${formattedWeek}`);
        


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();


        if (data.message === "AUCUNE ASSIGNATION") {
            console.warn("🚨 Aucune assignation trouvée pour cette semaine.");
            setPostesPersonnel(null);
            setMaxTempsParSemaine(null);
            return;
        }

        if (Array.isArray(data)) {


            // 🔍 Recherche de la personne affectée à "MO_MEN_FINIT06"
            const personne = data.find(item => item.poste_code === "MO_MEN_FINIT06");

            if (!personne) {
                console.warn("🚨 Aucun poste avec le code 'MO_MEN_FINIT06' trouvé !");
                setPostesPersonnel(null);
                setMaxTempsParSemaine(null);
                return;
            }

            // 🕒 Extraire et convertir les heures en secondes
            const heuresDisponibles = {
                lundi: parseTimeToSeconds(personne.lundi || "00:00:00"),
                mardi: parseTimeToSeconds(personne.mardi || "00:00:00"),
                mercredi: parseTimeToSeconds(personne.mercredi || "00:00:00"),
                jeudi: parseTimeToSeconds(personne.jeudi || "00:00:00"),
                vendredi: parseTimeToSeconds(personne.vendredi || "00:00:00"),
            };



            // 🔹 Conversion du total en heures et mise à jour de `maxTempsParSemaine`
            const totalSemaine = Object.values(heuresDisponibles).reduce((acc, val) => acc + val, 0) / 3600;


            setMaxTempsParSemaine(totalSemaine);
            setPostesPersonnel(data);
        } else {
            console.error("❌ Données des postes personnel non valides :", data);
        }
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des postes personnel :", error);
    }
};
  
  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return 0;

    const timeParts = timeStr.split(":").map(Number);

    if (timeParts.length !== 3 || timeParts.some(isNaN)) {
        console.warn("⚠️ Format invalide pour le temps :", timeStr);
        return 0;
    }

    const [hours, minutes, seconds] = timeParts;
    return hours * 3600 + minutes * 60 + seconds;
};


  const fetchData = async (startDate, endDate) => {
    try {


        const response = await fetch(
            `http://192.168.1.18:4000/api/systemes/psl?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();


        setPslData(data);
        setNombreCommandes(data.length);

        let totalInSeconds = data.reduce((acc, item) => {
            if (!item.temps) return acc;
            const [hours, minutes, seconds] = item.temps.split(":").map(Number);
            return acc + (hours * 3600 + minutes * 60 + seconds);
        }, 0);



        setTotalTemps(totalInSeconds);

        // 🔹 Mise à jour du total de la semaine actuelle sans accumulation des semaines précédentes
        setTotalTempsCumule((prev) => {
            const newTotal = totalTemps + totalInSeconds; // Somme correcte des temps PSL + PSPP de la semaine

            return newTotal;
        });

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données PSL :", error);
    }
};


// 🔹 Mise à jour des postes de personnel
useEffect(() => {

  
    if (selectedWeek && selectedWeek.trim() !== "") {
        fetchPostesPersonnel();
    } else {
        console.warn("⚠️ selectedWeek est vide ou invalide, requête non envoyée.");
    }
}, [selectedWeek]);

// 🔹 Chargement des données PSL
useEffect(() => {

    if (selectedWeek) {
        const { from, to } = getDateRangeFromWeek(selectedWeek);
        fetchData(from.toISOString().split("T")[0], to.toISOString().split("T")[0]);
    }
}, [selectedWeek, postesPersonnel]);

// 🔹 Mise à jour de la progression en fonction du total cumulé
useEffect(() => {


    if (!maxTempsParSemaine || maxTempsParSemaine <= 0) {
        console.warn("⚠️ maxTempsParSemaine est invalide, impossible de calculer la progression !");
        setProgress(0); // 🔹 Réinitialiser pour éviter une valeur incorrecte
        return;
    }

    const totalTempsInHours = totalTempsCumule / 3600;
    const progressPercentage = ((totalTempsInHours / maxTempsParSemaine) * 100).toFixed(1);
    setProgress(progressPercentage);
}, [totalTempsCumule, maxTempsParSemaine]);

// 🔹 Mise à jour des données PSL
useEffect(() => {
  if (Array.isArray(pslData) && pslData.length > 0) {
      let totalInSeconds = pslData.reduce((acc, item) => {
          if (!item.temps) return acc;
          const timeParts = item.temps.split(":").map(Number);
          return acc + (timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]);
      }, 0);

      setTotalTemps(totalInSeconds);
      setTotalTempsCumule(() => {
          const newTotal = totalTemps + totalInSeconds; // 🟢 Addition des valeurs de la semaine actuelle
          return newTotal;
      });
  }
}, [pslData]);



  
  
  return (
    <>
      <div
        className={`bg-white p-8 rounded-lg shadow-md flex flex-col items-center cursor-pointer
                    hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-out
                    min-w-[320px] min-h-[220px] relative hover:ring-4 hover:ring-blue-300/50
                    ${postesPersonnel === null ? 'blink-red' : ''}`}
        onClick={() => setIsModalOpen(true)}
      >
        <h2 className="text-2xl font-bold mb-2">PSL / PSPP</h2>
        <p className="font-semibold">
          Temps total saisi : {convertToHoursAndMinutes(totalTempsCumule)}
        </p>

        <p className="font-semibold">
          {postesPersonnel === null
            ? "🛑 AUCUNE ASSIGNATION"
            : maxTempsParSemaine !== null
            ? `Max par semaine : ${maxTempsParSemaine.toFixed(1)}h`
            : "⏳ Chargement..."}
        </p>
        <ProgressChart progressPercentage={progress} />
        <p className="mt-2 text-center">Progression : {progress}%</p>
        <p className="mt-1 text-center font-semibold">Nombre de Portes : {nombreCommandes}</p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-out animate-fade-in z-[1000]">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full transform transition-transform duration-500 ease-out animate-zoom-in min-h-[320px] z-[1010]">

            <h3 className="text-xl font-bold mb-4">Détails des Types PSL et PSPP</h3>

            {/* Comptage des types */}
            {(() => {
              const typeCounts = {};

              pslData.forEach((item) => {
                const type = item.texte;
                if (typeCounts[type]) {
                  typeCounts[type]++;
                } else {
                  typeCounts[type] = 1;
                }
              });

              return (
                <div className="mb-4 p-4 bg-gray-100 rounded-md text-center shadow-sm">
                  {Object.entries(typeCounts).map(([type, count], index) => (
                    <p key={index} className="text-lg font-semibold">
                        📌 Nombre de commandes {"\"" + type + "\""} :
                        <span className="text-blue-600"> {count} </span>
                    </p>                  
                  ))}
                </div>
              );
            })()}

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
              {pslData.length > 0 ? (
                pslData.map((item, index) => (
                  <li key={index} className="border p-4 rounded-md shadow-sm bg-gray-50">
                    <p><strong>Commande :</strong> {item.commande}</p>
                    <p><strong>Description :</strong> {item.descriptio}</p>
                    <p><strong>Type :</strong> {item.texte}</p>
                    <p><strong>Quantité :</strong> {item.quantite}</p>
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

export default PslCard;
