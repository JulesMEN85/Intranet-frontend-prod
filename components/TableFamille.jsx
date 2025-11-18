import React, { useEffect, useState } from "react";
import LoaderTable from "@/components/LoaderTable";
import { baseURL } from "@/utils/baseURL";
import ModalNouvelleFamille from "./ModalNouvelleFamille";
import EditRemise from "./ModalEditRemise";
import ConfirmDeleteModal from "./ModalConfirmDelete";
import useUserStore from "@/store/userStore"; // Pas @/stores, pas destructuré

const TableFamille = () => {
  const [loading, setLoading] = useState(true);
  const [familles, setFamilles] = useState([]);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [editingFamille, setEditingFamille] = useState(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const { userLevel } = useUserStore();

  useEffect(() => {
    //On récupère toutes les familles de remise
    fetch(`${baseURL}/api/family/all`)
      .then((res) => res.json())
      .then((data) => {
        setFamilles(data.familles || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les familles de remise.");
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (famille) => {
    setDeleteTarget(famille);
    setDeleteMessage(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `${baseURL}/api/family/delete/${deleteTarget.famille_remise}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (res.ok) {
        setFamilles((prev) =>
          prev.filter((f) => f.famille_remise !== deleteTarget.famille_remise)
        );
        setDeleteMessage(json.message || "Famille supprimée avec succès");
        setTimeout(() => {
          setDeleteTarget(null);
          setDeleteMessage(null);
        }, 1500);
      } else {
        setDeleteMessage(json.error || "Erreur lors de la suppression");
      }
    } catch {
      setDeleteMessage("Erreur réseau lors de la suppression.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setDeleteMessage(null);
  };

  const handleEdit = (famille) => {
    setEditingFamille(famille);
  };

  const handleSave = (newName) => {
    setFamilles((prev) =>
      prev.map((f) =>
        f.famille_remise === editingFamille.famille_remise
          ? { ...f, name: newName }
          : f
      )
    );
  };

  const handleCloseModal = () => {
    setEditingFamille(null);
  };

  const handleAddFamily = (familleObj) => {
    setFamilles((prev) => [...prev, familleObj]);
  };

  if (loading) return <LoaderTable />;
  if (error)
    return <div className="text-red-600 text-center my-10">{error}</div>;
  if (!familles.length)
    return (
      <div className="text-gray-500 text-center my-10">
        Aucune famille de remise enregistrée.
      </div>
    );

  return (
    <>
      {userLevel === 1 && (
        <button
          className="mb-4 px-4 py-2 bg-sky-700 text-white font-bold rounded hover:bg-sky-800 shadow"
          onClick={() => setNewModalOpen(true)}
        >
          Nouvelle famille
        </button>
      )}

      <table className="min-w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">
              Code Famille Remise
            </th>
            <th className="px-4 py-2 border border-gray-300">
              Nom de la famille
            </th>
            <th className="px-4 py-2 border border-gray-300">Supprimable</th>
            {userLevel === 1 && (
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {familles.map((famille) => (
            <tr key={famille.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {famille.famille_remise}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {famille.name}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {famille.est_supprimable ? "Oui" : "Non"}
              </td>
              {userLevel === 1 && (
                <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(famille)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                  {famille.est_supprimable === 1 && (
                    <button
                      onClick={() => handleDeleteClick(famille)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {newModalOpen && (
        <ModalNouvelleFamille
          onClose={() => setNewModalOpen(false)}
          onAdd={handleAddFamily}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          message={
            deleteMessage ||
            `Voulez-vous vraiment supprimer la famille "${deleteTarget.name}" ?`
          }
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {editingFamille && (
        <EditRemise
          famille={editingFamille}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default TableFamille;
