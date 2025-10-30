import React from "react";
//Modal affichant le tableau des différentes remises pour un client
const ModalRemisesClient = ({
  remises,
  client,
  onClose,
  onEdit,
  setAddRemiseModalOpen,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded p-6 min-w-[550px] max-w-full shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-center">
        Remises de {client.nom} ({client.CODE})
      </h2>

      <table className="w-full border-collapse border border-gray-300 bg-white mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">
              Famille de Remise
            </th>
            <th className="px-4 py-2 border border-gray-300">Nom famille</th>
            <th className="px-4 py-2 border border-gray-300">Valeur</th>
            <th className="px-4 py-2 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {remises.length > 0 ? (
            remises.map((r, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {r.idRemise}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center whitespace-pre-line">
                  {!r.name || String(r.name).trim() === ""
                    ? "famille supprimé"
                    : r.name}
                </td>

                <td className="border border-gray-300 px-4 py-2 text-center">
                  {r.valeur}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => onEdit(r)}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Aucune remise/famille correspondante
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setAddRemiseModalOpen(true)}
        >
          Ajouter une remise
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
);

export default ModalRemisesClient;
