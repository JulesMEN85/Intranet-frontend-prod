"use client";
import { useState } from "react";
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
import AddPosteModal from "@/components/AddPosteModal";
import AssignPersonnelModal from "@/components/AssignPersonnelModal";
import EditPosteModal from "@/components/EditPosteModal";

const PosteTable = () => {
  const [rowsTable2, setRowsTable2] = useState([]);
  const [isAddPosteModalOpen, setAddPosteModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [isEditPosteModalOpen, setEditPosteModalOpen] = useState(false);
  const [currentPosteId, setCurrentPosteId] = useState(null);
  const [editPosteData, setEditPosteData] = useState(null);

  const handleAddPoste = (newPoste) => {
    setRowsTable2([
      ...rowsTable2,
      { id: Date.now(), ...newPoste, categories: [] },
    ]);
  };

  const handleEditPoste = (poste) => {
    setEditPosteData(poste);
    setEditPosteModalOpen(true);
  };

  const handleSaveEditPoste = (updatedPoste) => {
    setRowsTable2((prev) =>
      prev.map((row) => (row.id === updatedPoste.id ? updatedPoste : row))
    );
    setEditPosteModalOpen(false);
  };

  const handleAssignPersonnel = (posteId) => {
    setCurrentPosteId(posteId);
    setAssignModalOpen(true);
  };

  const handleSaveAssignedPersonnel = (selectedPersonnel) => {
    setRowsTable2((prev) =>
      prev.map((row) =>
        row.id === currentPosteId
          ? { ...row, categories: selectedPersonnel }
          : row
      )
    );
    setAssignModalOpen(false);
  };

  const handleDeletePoste = (id) => {
    setRowsTable2((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Modals */}
      <AddPosteModal
        isOpen={isAddPosteModalOpen}
        onClose={() => setAddPosteModalOpen(false)}
        onAdd={handleAddPoste}
      />
      <AssignPersonnelModal
        isOpen={isAssignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onSave={handleSaveAssignedPersonnel}
        personnel={rowsTable2}
        selectedPersonnel={
          currentPosteId
            ? rowsTable2.find((row) => row.id === currentPosteId)?.categories ||
              []
            : []
        }
      />
      <EditPosteModal
        isOpen={isEditPosteModalOpen}
        onClose={() => setEditPosteModalOpen(false)}
        onSave={handleSaveEditPoste}
        initialData={editPosteData}
      />

      {/* Table */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Postes</h2>
        <Button
          className="bg-sky-950 text-white hover:bg-sky-900"
          onClick={() => setAddPosteModalOpen(true)}
        >
          Ajouter un poste
        </Button>
      </div>
      <div className={`overflow-y-auto ${rowsTable2.length > 4 ? "max-h-60" : ""}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Temps (heures)</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Progression</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowsTable2.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignPersonnel(row.id)}
                  >
                    {row.categories.length > 0
                      ? row.categories.join(", ")
                      : "Ajouter"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Progress
                    value={Math.min((row.time / 40) * 100, 100)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPoste(row)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePoste(row.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PosteTable;
