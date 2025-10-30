"use client";
//Modal pour demander à confirmer la suppression d'une famille
const ConfirmDeleteModal = ({ onConfirm, onCancel, message }) => {
  const isSuccess = message && message.toLowerCase().includes("supprimée");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 w-80 shadow-lg">
        <p className="mb-4">{message || "Confirmez-vous cette action ?"}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded"
            disabled={isSuccess}
          >
            Annuler
          </button>
          {!isSuccess && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
