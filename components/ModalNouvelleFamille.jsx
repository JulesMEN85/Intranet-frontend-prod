"use client";
//Modal pour l'ajout d'une nouvelle famille
import React, { useState } from "react";
import { baseURL } from "@/utils/baseURL";

const ModalNewFamily = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [familleRemise, setFamilleRemise] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
        //on envoie nos données vers le backend
      const res = await fetch(`${baseURL}/api/family/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, famille_remise: familleRemise }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage(json.message || "Famille ajoutée !");
        onAdd({
          id: json.id,
          name,
          famille_remise: familleRemise,
          est_supprimable: 1,
        });
        setTimeout(onClose, 1500);
      } else {
        setMessage(json.error || "Erreur lors de l'ajout");
      }
    } catch {
      setMessage("Erreur réseau");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          Ajouter une nouvelle famille de remise
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            placeholder="Nom de la famille"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            placeholder="Code Famille Remise"
            value={familleRemise}
            onChange={(e) => setFamilleRemise(e.target.value)}
            disabled={loading}
            required
          />
          {message && (
            <p
              className={`mb-2 ${
                message.includes("Erreur") ? "text-red-500" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNewFamily;
