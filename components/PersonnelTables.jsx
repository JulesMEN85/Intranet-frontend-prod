"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Progress from "@/components/ui/Progress";
import AddPersonModal from "@/components/AddPersonModal";
import EditModal from "@/components/EditModal";

const timeStringToMinutes = (timeString) => {
  if (!timeString) return 0;

  const [hours, minutes, seconds = 0] = timeString.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
};

const PersonnelTables = ({ selectedWeek }) => {
  const [rowsTable1, setRowsTable1] = useState([]); // Données pour la table
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editPersonData, setEditPersonData] = useState(null);

  // Charger les données lorsque la semaine sélectionnée change
  useEffect(() => {
    if (selectedWeek) {
      loadWeeklyPlanning(selectedWeek);
    }
  }, [selectedWeek]);

  // Charger les personnels de base
  const loadBasePersonnel = async () => {
    try {
      const response = await fetch(`http://192.168.1.18:4000/api/planning/base-personnel`);
      
      // Vérification de la réponse HTTP
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
  
      // Conversion en JSON
      const personnel = await response.json();
  
      // Vérification des données reçues
      console.log("Données reçues de base-personnel :", personnel);
  
      // Mise à jour du state
      setRowsTable1(personnel);
    } catch (error) {
      console.error("Erreur lors du chargement des personnels :", error.message);
    }
  };  

  // Charger le planning hebdomadaire
  const loadWeeklyPlanning = async (week) => {
    try {
      const response = await fetch(
        `http://192.168.1.18:4000/api/planning/weekly-planning?startDate=${week}`
      );
  
      // Vérification de la réponse HTTP
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
  
      // Conversion en JSON
      const planning = await response.json();
  
      // Vérification des données reçues
      console.log("Données reçues de weekly-planning :", planning);
  
      // Mise à jour du state
      setRowsTable1(planning);
    } catch (error) {
      console.error("Erreur lors du chargement des plannings :", error.message);
    }
  };
  

// Ajouter un personnel
const handleAddPerson = async (newPerson) => {
  try {
    console.log("Données envoyées :", newPerson);

    // Vérifiez ici quelle route utiliser en fonction du contexte
    const endpoint = "http://192.168.1.18:4000/api/planning/with-personnel";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'ajout.");
    }

    console.log("Ajout réussi !");
    loadBasePersonnel(); // Rechargez les données après l'ajout
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error.message);
  }
};


  // Modifier un personnel
  const handleSaveEditPerson = async (updatedPerson) => {
    try {
      const response = await fetch(
        `http://192.168.1.18:4000/api/planning/base-personnel/${updatedPerson.id}/${selectedWeek}`, // Ajout de la semaine sélectionnée
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPerson),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour des données");
      }
  
      console.log("Mise à jour réussie :", updatedPerson);
  
      // Mettre à jour dynamiquement les données dans `rowsTable1`
      setRowsTable1((prevRows) =>
        prevRows.map((row) =>
          row.id === updatedPerson.id && row.semaine === selectedWeek
            ? {
                ...row,
                ...updatedPerson,
              }
            : row
        )
      );
  
      setEditModalOpen(false); // Ferme le modal
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };
  
  
  
  

  // Supprimer un personnel
  const handleDeletePerson = async (id, semaine) => {
    try {
        const response = await fetch(
            `http://192.168.1.18:4000/api/planning/base-personnel/${id}/${semaine}`, // Ajout de la semaine dans l'URL
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la suppression.");
        }

        console.log(`Personne avec ID ${id} supprimée pour la semaine ${semaine}.`);

        // Met à jour l'affichage en supprimant uniquement la ligne concernée
        setRowsTable1((prevRows) => prevRows.filter(row => !(row.id === id && row.semaine === semaine)));

    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
};

  const handleEditClick = (row) => {
    console.log("Personne sélectionnée pour modification :", row);
    setEditPersonData(row);
    setEditModalOpen(true); // Ouvre le modal
  };
  

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Modals */}
      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddPerson}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEditPerson}
        initialData={editPersonData}
      />
  
      {/* Conteneur principal pour le tableau */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
        {/* En-tête du tableau */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Base Personnel</h2>
          <Button
            className="bg-sky-950 text-white hover:bg-sky-900"
            onClick={() => setAddModalOpen(true)}
          >
            Ajouter une personne
          </Button>
        </div>
  
        {/* Table avec une limite de 8 lignes */}
        <div className="max-h-[735px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Semaine</TableHead>
                <TableHead>Lundi</TableHead>
                <TableHead>Mardi</TableHead>
                <TableHead>Mercredi</TableHead>
                <TableHead>Jeudi</TableHead>
                <TableHead>Vendredi</TableHead>
                <TableHead>Temps Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowsTable1.map((row, index) => {
                const totalMinutes = [
                  timeStringToMinutes(row.lundi),
                  timeStringToMinutes(row.mardi),
                  timeStringToMinutes(row.mercredi),
                  timeStringToMinutes(row.jeudi),
                  timeStringToMinutes(row.vendredi),
                ].reduce((sum, val) => sum + val, 0);

                const totalHours = (totalMinutes / 60).toFixed(2);
                const percentage = Math.min((totalHours / 40) * 100, 100);

                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.semaine || "Toutes les semaines"}</TableCell>
                    <TableCell>{row.lundi || "-"}</TableCell>
                    <TableCell>{row.mardi || "-"}</TableCell>
                    <TableCell>{row.mercredi || "-"}</TableCell>
                    <TableCell>{row.jeudi || "-"}</TableCell>
                    <TableCell>{row.vendredi || "-"}</TableCell>
                    <TableCell>
                      <div>
                        {row.totalHours || totalHours} h
                        <Progress value={row.percentage || percentage} className="mt-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(row)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePerson(row.id, row.semaine)} // On passe aussi la semaine
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );   
};

export default PersonnelTables;
