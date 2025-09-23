"use client";

import { useState } from "react";
import PspCard from "./systemes/PspCard"; // ✅ Carte 1
import PslCard from "./systemes/PslCard"; // ✅ Carte 2
import PVC38Card from "./systemes/PVC38Card"; // ✅ Carte 3 (Ajoutée)
import PgbPgcCard from "./systemes/pgb-pgcCard"; // ✅ Carte 4
import VoletpvcCard from "./systemes/VoletpvcCard"; // ✅ Carte 5
import VoletAluCard from "./systemes/VoletAluCard"; // ✅ Carte 6
import StatsTempsChart from "./systemes/statsCard"; //

const Maxsemaine = ({ selectedWeek }) => {
  // État global pour le temps maximal disponible pour les postes
  const [maxTempsParSemaine, setMaxTempsParSemaine] = useState(null);

  // État global pour le cumul du temps total (Psp + Psl + PVC38)
  const [totalTempsCumule, setTotalTempsCumule] = useState(0);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full auto-rows-fr">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
        num === 1 ? (
          <PspCard
            key={num}
            selectedWeek={selectedWeek}
            maxTempsParSemaine={maxTempsParSemaine}
            setMaxTempsParSemaine={setMaxTempsParSemaine}
            totalTempsCumule={totalTempsCumule}
            setTotalTempsCumule={setTotalTempsCumule}
          />
        ) : num === 2 ? (
          <PslCard
            key={num}
            selectedWeek={selectedWeek}
            maxTempsParSemaine={maxTempsParSemaine}
            setMaxTempsParSemaine={setMaxTempsParSemaine}
            totalTempsCumule={totalTempsCumule}
            setTotalTempsCumule={setTotalTempsCumule}
          />
        ) : num === 3 ? (
          <PVC38Card
            key={num}
            selectedWeek={selectedWeek}
            maxTempsParSemaine={maxTempsParSemaine}
            setMaxTempsParSemaine={setMaxTempsParSemaine}
            totalTempsCumule={totalTempsCumule}
            setTotalTempsCumule={setTotalTempsCumule}
          />
        ) : num === 4 ? (
          <PgbPgcCard
            key={num}
            selectedWeek={selectedWeek}
            maxTempsParSemaine={maxTempsParSemaine}
            setMaxTempsParSemaine={setMaxTempsParSemaine}
            totalTempsCumule={totalTempsCumule}
            setTotalTempsCumule={setTotalTempsCumule}
          />
        ) : num === 5 ? (
          <VoletpvcCard
            key={num}
            selectedWeek={selectedWeek}
            maxTempsParSemaine={maxTempsParSemaine}
            setMaxTempsParSemaine={setMaxTempsParSemaine}
            totalTempsCumule={totalTempsCumule}
            setTotalTempsCumule={setTotalTempsCumule}
          />
        ) : num === 6 ? (
          <VoletAluCard
            key={num}
            selectedWeek={selectedWeek}
            maxTempsParSemaine={maxTempsParSemaine}
            setMaxTempsParSemaine={setMaxTempsParSemaine}
            totalTempsCumule={totalTempsCumule}
            setTotalTempsCumule={setTotalTempsCumule}
          />
        ) : num === 8 ? (
          <StatsTempsChart
            key={num}
            selectedWeek={selectedWeek}
            maxTempsParSemaine={maxTempsParSemaine}
            setMaxTempsParSemaine={setMaxTempsParSemaine}
            totalTempsCumule={totalTempsCumule}
            setTotalTempsCumule={setTotalTempsCumule}
          />
        ) : (
          <div
            key={num}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center w-full h-full"
          >
            <p className="text-xl font-bold">Carte {num}</p>
          </div>
        )
      ))}
    </div>
  );
};

export default Maxsemaine;
