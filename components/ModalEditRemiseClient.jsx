import React from "react";
//Modal pour la modification d'une remise d'une famille pour un client
const ModalEditRemiseClient = ({
  remise,
  client,
  valeur,
  setValeur,
  loading,
  error,
  success,
  onClose,
  onConfirm,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded p-6 w-80 shadow-lg">
      <h2 className="text-lg font-bold mb-4">
        Modifier la remise {remise.idRemise} ({remise.name}) pour {client.nom}
      </h2>
      <input
        type="number"
        className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
        min={0}
        disabled={loading || !!success}
        placeholder="Nouvelle valeur"
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
          disabled={loading || !!success}
        >
          {loading ? "Envoi..." : "Confirmer"}
        </button>
      </div>
    </div>
  </div>
);

export default ModalEditRemiseClient;
