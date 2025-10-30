import React from "react";
const ModalAddRemiseClient = ({
  familles,
  remises,
  client,
  open,
  onClose,
  selectedFamille,
  setSelectedFamille,
  valeur,
  setValeur,
  loading,
  error,
  success,
  onConfirm,
}) => {
  const existingIds = remises.map((r) => String(r.idRemise));
  // On filtre le dropdown pour retirer les idRemise qui existent deja
  const famillesRestantes = familles.filter(
    (f) => !existingIds.includes(String(f.famille_remise))
  );

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          Ajouter une remise à {client.nom} ({client.CODE})
        </h2>
        <label className="block mb-2 font-medium">Type de famille :</label>
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
          value={selectedFamille}
          onChange={(e) => setSelectedFamille(e.target.value)}
          disabled={loading || !!success}
        >
          <option value="">-- Sélectionner --</option>
          {famillesRestantes.map((f) => (
            <option key={f.famille_remise} value={f.famille_remise}>
              {f.famille_remise} - {f.name}
            </option>
          ))}
        </select>
        <label className="block mb-2 font-medium">Nouvelle valeur :</label>
        <input
          type="number"
          className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
          value={valeur}
          onChange={(e) => setValeur(e.target.value)}
          min={0}
          disabled={loading || !!success}
          placeholder="Valeur"
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && (
          <div className="text-green-600 mb-2 text-center font-bold">
            {success}
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
            onClick={onConfirm}
            disabled={!selectedFamille || !valeur || loading || !!success}
          >
            {loading ? "Envoi..." : "Valider"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddRemiseClient;
