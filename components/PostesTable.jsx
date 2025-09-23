"use client";
import { useEffect, useState } from "react";
import ModalConfigPostes from "@/components/ModalConfigPostes";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const PostesTable = ({ selectedWeek }) => {
  const [postes, setPostes] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState({});
  const [defaultAssignments, setDefaultAssignments] = useState({});
  const [uniquePersonnel, setUniquePersonnel] = useState([]);
  const [uniquePostes, setUniquePostes] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempsDisponibleMap, setTempsDisponibleMap] = useState({}); // 🆕 Nouveau state
  const [totalTempsTachesParPersonnel, setTotalTempsTachesParPersonnel] = useState({});
  const [tempsRestantMinParPersonnel, setTempsRestantMinParPersonnel] = useState({});


  const fetchPostes = async () => {
    if (!selectedWeek) return;
    try {
      console.log("Fetching postes...");
      const response = await fetch(`http://192.168.1.18:4000/api/taux-de-charge?week=${selectedWeek}`);
      if (!response.ok) throw new Error(`Erreur ${response.status}: Impossible de récupérer les postes.`);
      const data = await response.json();
      console.log("Postes fetched:", data);
      setPostes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUniquePersonnel = async () => {
    try {
      console.log("Fetching unique personnel...");
      const response = await fetch("http://192.168.1.18:4000/api/unique-personnel");
      const data = await response.json();
      console.log("Unique personnel fetched:", data);
      setUniquePersonnel(data);
    } catch (error) {
      console.error("Erreur API (fetchUniquePersonnel) :", error);
    }
  };

  const fetchUniquePostes = async () => {
    try {
      console.log("Fetching unique postes...");
      const response = await fetch("http://192.168.1.18:4000/api/unique-postes");
      const data = await response.json();
      console.log("Unique postes fetched:", data);
      setUniquePostes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des postes uniques :", error);
    }
  };

  const fetchDefaultAssignments = async () => {
    try {
      console.log("Fetching default assignments...");
      const response = await fetch("http://192.168.1.18:4000/api/postes/default-assignments");
      const data = await response.json();
      console.log("Default assignments fetched:", data);

      const formattedAssignments = data.reduce((acc, assignment) => {
        const totalHeuresDispo = (assignment.lundi || 0) + (assignment.mardi || 0) + (assignment.mercredi || 0) + (assignment.jeudi || 0) + (assignment.vendredi || 0);
        acc[assignment.poste_code] = {
          personnel_id: assignment.personnel_id,
          name: assignment.name,
          temps_disponible: totalHeuresDispo,
        };
        return acc;
      }, {});

      if (JSON.stringify(formattedAssignments) !== JSON.stringify(defaultAssignments)) {
        setDefaultAssignments(formattedAssignments);
        setAssignments(formattedAssignments);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des affectations par défaut :", error);
    }
  };

  const fetchPersonnelAvailability = async (name, semaine) => {
    try {
      const response = await fetch(`http://192.168.1.18:4000/api/postes/personnel-availability?name=${encodeURIComponent(name)}&semaine=${semaine}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération du temps disponible.");
      const data = await response.json();
      return data[0]?.total_heures_disponible || "00:00:00";
    } catch (error) {
      console.error(`Erreur lors de la récupération du temps disponible pour ${name} :`, error);
      return "00:00:00";
    }
  };

  const ProgressBar = ({ used, available }) => {
    const percentage = available > 0 ? Math.min((used / available) * 100, 100) : 0;
  
    // Détermination de la couleur en fonction du pourcentage
    let color;
    if (percentage < 50) {
      color = "bg-green-500"; // Vert
    } else if (percentage < 80) {
      color = "bg-orange-500"; // Orange
    } else {
      color = "bg-red-500"; // Rouge (alerte)
    }
  
    return (
      <div className="w-full bg-gray-200 rounded-full h-3 mt-1 overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-[width] duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const regrouperPostesParCode = (postes) => {
    return postes.reduce((acc, poste) => {
      if (acc[poste.code]) {
        acc[poste.code].total_secondes += poste.total_secondes; // Addition du temps
      } else {
        acc[poste.code] = { ...poste }; // Nouveau poste
      }
      return acc;
    }, {});
  };  

  const removeAssignment = async (posteCode) => {
    try {
      const deleteResponse = await fetch("http://192.168.1.18:4000/api/postes/default-assignments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poste_codes: [posteCode] }), // Envoi du code du poste à supprimer
      });
  
      const deleteResponseText = await deleteResponse.text();
      console.log("🗑️ Affectation supprimée :", deleteResponseText);
  
      if (!deleteResponse.ok) {
        throw new Error(deleteResponseText || "Erreur lors de la suppression.");
      }
  
      // ✅ Mise à jour de l'état côté front après suppression
      setAssignments((prev) => {
        const updatedAssignments = { ...prev };
        delete updatedAssignments[posteCode];
        return updatedAssignments;
      });
  
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'affectation :", error);
    }
  };
  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      console.log("Starting data fetch...");
  
      try {
        await Promise.all([
          fetchUniquePersonnel(),
          fetchUniquePostes(),
          fetchPostes(),
          fetchDefaultAssignments(),
        ]);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
        console.log("Data fetch complete.");
      }
    };
  
    if (selectedWeek) {
      fetchData();
    }
  }, [selectedWeek]);
  
  useEffect(() => {
    console.log("Default assignments updated:", defaultAssignments);
    setAssignments((prev) => ({ ...prev, ...defaultAssignments }));
  }, [defaultAssignments]);
  
  useEffect(() => {
    const fetchDisponibilites = async () => {
      const newDisponibilites = {};
      for (const poste of postes) {
        const assignedPersonnel = assignments[poste.code];
        if (assignedPersonnel?.name && selectedWeek) {
          const availability = await fetchPersonnelAvailability(assignedPersonnel.name, selectedWeek);
          newDisponibilites[poste.code] = availability;
        } else {
          newDisponibilites[poste.code] = "00:00:00";
        }
      }
      setTempsDisponibleMap(newDisponibilites);
    };
  
    if (postes.length > 0 && Object.keys(assignments).length > 0) {
      fetchDisponibilites();
    }
  }, [postes, assignments, selectedWeek]);
  
  useEffect(() => {
    const calculerTemps = () => {
      const tempsRestantParPersonnel = {};
      const totalTachesParPersonnel = {};
  
      postes.forEach((poste) => {
        const assignedPersonnel = assignments[poste.code];
        const tempsDisponible = tempsDisponibleMap[poste.code] || "00:00:00";
  
        if (assignedPersonnel?.name) {
          const [hours, minutes, seconds] = tempsDisponible.split(":").map(Number);
          const totalMinutesDisponible = hours * 60 + minutes + seconds / 60;
          const tempsRestant = totalMinutesDisponible - poste.total_secondes / 60;
  
          // Temps restant
          if (
            !(assignedPersonnel.name in tempsRestantParPersonnel) ||
            tempsRestant < tempsRestantParPersonnel[assignedPersonnel.name]
          ) {
            tempsRestantParPersonnel[assignedPersonnel.name] = tempsRestant;
          }
  
          // Total des tâches
          if (!totalTachesParPersonnel[assignedPersonnel.name]) {
            totalTachesParPersonnel[assignedPersonnel.name] = 0;
          }
          totalTachesParPersonnel[assignedPersonnel.name] += poste.total_secondes / 60;
        }
      });
  
      setTempsRestantMinParPersonnel(tempsRestantParPersonnel);
      setTotalTempsTachesParPersonnel(totalTachesParPersonnel);
    };
  
    calculerTemps();
  }, [postes, assignments, tempsDisponibleMap]);
  
  

  if (isLoading) return <div>Chargement des données...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-h-[735px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Postes - {selectedWeek || "Aucune semaine sélectionnée"}
        </h2>
        <button
          onClick={openModal}
          className="bg-sky-950 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transform transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"        >
          Configurer les affectations
        </button>
      </div>
  
      {/* ✅ Calcul du nombre de postes */}
      {(() => {
        const postesRegroupes = Object.values(regrouperPostesParCode(postes));
        const nombreDePostes = postesRegroupes.length;
  
        return (
          <>
            <div className="text-sm text-gray-600 mt-2">
              Nombre total de postes pour la semaine :{" "}
              <span className="font-bold">{nombreDePostes}</span>
            </div>
  
            {postesRegroupes.length === 0 ? (
              <div>Aucun poste pour la semaine sélectionnée.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Temps Total (heures)</TableHead>
                    <TableHead>Personnel Assigné</TableHead>
                    <TableHead>Temps Disponible</TableHead>
                    <TableHead>Total Temps Tâches</TableHead>
                  </TableRow>
                </TableHeader>
  
                <TableBody>
                  {postesRegroupes.map((poste, index) => {
                    const assignedPersonnel = assignments[poste.code];
                    const tempsDisponible = tempsDisponibleMap[poste.code] || "00:00:00";
  
                    const [hours, minutes, seconds] = tempsDisponible
                      .split(":")
                      .map(Number);
                    const totalMinutesDisponible =
                      hours * 60 + minutes + seconds / 60;
  
                    const totalTempsTaches = assignedPersonnel
                      ? totalTempsTachesParPersonnel[assignedPersonnel.name] || 0
                      : 0;
  
                    return (
                      <TableRow key={index}>
                        <TableCell>{poste.code}</TableCell>
                        <TableCell>{poste.descriptio}</TableCell>
                        <TableCell>
                          {Math.floor(poste.total_secondes / 3600)}h{" "}
                          {Math.floor((poste.total_secondes % 3600) / 60)}m
                        </TableCell>
  
                        {/* ✅ Colonne Personnel Assigné avec suppression */}
                        <TableCell>
                          {assignedPersonnel?.name ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600 font-medium">
                                {assignedPersonnel.name}
                              </span>
                              <button
                                onClick={() => removeAssignment(poste.code)}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                                title="Supprimer l'affectation"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">Aucune affectation</span>
                          )}
                        </TableCell>

  
                        <TableCell>
                          {tempsDisponible !== "00:00:00"
                            ? `${tempsDisponible.split(":")[0]}h ${
                                tempsDisponible.split(":")[1]
                              }m`
                            : "Temps indisponible..."}
                        </TableCell>
  
                        <TableCell>
                          {totalTempsTaches > 0
                            ? `${Math.floor(totalTempsTaches / 60)}h ${Math.floor(
                                totalTempsTaches % 60
                              )}m`
                            : "Aucune tâche"}
                          <ProgressBar
                            used={totalTempsTaches}
                            available={totalMinutesDisponible}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </>
        );
      })()}
  
      {/* ✅ Le Modal est toujours fonctionnel */}
      <ModalConfigPostes
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={fetchDefaultAssignments}
        uniquePersonnel={uniquePersonnel}
        uniquePostes={uniquePostes}
      />
    </div>
  );  
};

export default PostesTable;
