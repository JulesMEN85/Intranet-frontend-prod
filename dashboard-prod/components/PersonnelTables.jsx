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
import EditModal from "@/components/EditModal"; // Modal pour éditer une personne

const timeStringToMinutes = (timeString) => {
  if (!timeString) return 0;

  const [hours, minutes, seconds = 0] = timeString.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
};

const PersonnelTables = ({ selectedWeek }) => {
  const [rowsTable1, setRowsTable1] = useState([]); // Données pour la table base_personnel
  const [isAddModalOpen, setAddModalOpen] = useState(false); // Modal pour ajouter une personne
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal pour éditer une personne
  const [editPersonData, setEditPersonData] = useState(null); // Données à éditer

  useEffect(() => {
    loadBasePersonnel();
  }, [selectedWeek]);

  const loadBasePersonnel = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/planning/base-personnel"
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const personnel = await response.json();

      // Filtrer les données pour éviter les doublons
      const filteredPersonnel = personnel.reduce((acc, person) => {
        const existsInWeek = acc.some(
          (p) => p.name === person.name && p.semaine === selectedWeek
        );

        if (person.semaine === selectedWeek) {
          acc.push(person); // Ajouter uniquement pour la semaine sélectionnée
        } else if (!person.semaine && !existsInWeek) {
          acc.push(person); // Ajouter "Toutes les semaines" pour les autres semaines
        }

        return acc;
      }, []);

      setRowsTable1(filteredPersonnel);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  const handleAddPerson = async (newPerson) => {
    try {
        console.log("Données reçues par handleAddPerson :", newPerson);

        if (!newPerson.name || newPerson.name.trim() === "") {
            console.error("Erreur : Le champ 'name' est obligatoire.");
            throw new Error("Le champ 'name' est obligatoire.");
        }

        const response = await fetch("http://localhost:4000/api/planning/base-personnel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPerson),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur lors de l'ajout :", errorData);
            throw new Error(errorData.message || "Erreur lors de l'ajout");
        }

        const addedPerson = await response.json();
        console.log("Réponse API :", addedPerson);

        // Vérifiez si la semaine correspond à la semaine sélectionnée ou est vide
        if (addedPerson.semaine === selectedWeek || !addedPerson.semaine) {
            setRowsTable1((prevRows) => [...prevRows, addedPerson]);
        } else {
            // Recharge la table si nécessaire
            loadBasePersonnel();
        }

        setAddModalOpen(false);
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error.message || error);
    }
};




  const handleEditPerson = (person) => {
    setEditPersonData(person);
    setEditModalOpen(true);
  };

  const handleSaveEditPerson = async (updatedPerson) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/planning/base-personnel/${updatedPerson.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPerson),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour :", errorData);
        throw new Error("Erreur lors de la mise à jour des données");
      }

      setRowsTable1((prevRows) =>
        prevRows.map((row) =>
          row.id === updatedPerson.id ? { ...row, ...updatedPerson } : row
        )
      );

      setEditModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleDeletePerson = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/planning/base-personnel/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la suppression :", errorData);
        throw new Error("Erreur lors de la suppression");
      }

      // Supprimer la personne de la liste sans recharger
      setRowsTable1((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Modals */}
      <AddPersonModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddPerson}
          selectedWeek={selectedWeek} // Passe la semaine sélectionnée au modal
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEditPerson}
        initialData={editPersonData}
      />

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Base Personnel</h2>
          <Button
            className="bg-sky-950 text-white hover:bg-sky-900"
            onClick={() => setAddModalOpen(true)}
          >
            Ajouter une personne
          </Button>
        </div>
        <div
          className={`overflow-y-auto ${
            rowsTable1.length > 4 ? "max-h-60" : ""
          }`}
        >
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
            {rowsTable1.map((row) => {
              const totalTime = [
                timeStringToMinutes(row.lundi),
                timeStringToMinutes(row.mardi),
                timeStringToMinutes(row.mercredi),
                timeStringToMinutes(row.jeudi),
                timeStringToMinutes(row.vendredi),
              ].reduce((sum, val) => sum + val, 0);

              // Calcul du pourcentage du temps total par rapport à 40 heures (8 h/jour * 5 jours)
              const totalHours = totalTime / 60;
              const percentage = Math.min((totalHours / 40) * 100, 100); // Limité à 100 %

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
                      {(totalHours).toFixed(2)} h
                      <Progress value={percentage} className="mt-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPerson(row)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePerson(row.id)}
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
