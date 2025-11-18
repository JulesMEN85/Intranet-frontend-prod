"use client";

import { baseURL } from "@/utils/baseURL";
import React, { useState } from "react";

const EditRemise = ({ famille, onClose, onSave }) => {
  const [newName, setNewName] = useState(famille.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const saveChanges = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(
        //On envoie la requete pour modifier les remises des clients 
        `${baseURL}/api/family/edit/${famille.famille_remise}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Erreur lors de la mise à jour");
      } else {
        setSuccessMsg(json.message || "Mise à jour réussie");
        onSave(newName);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Modifier la famille</h2>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={loading}
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={saveChanges}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRemise;
