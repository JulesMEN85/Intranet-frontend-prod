import React from "react";

const Modalarticle = ({ isOpen, onClose, article }) => {
    if (!isOpen) return null;

    // Calcul de la somme
    const somme =
        Number(article?.Stock_courant || 0) -
        Number(article?.Reservation_client || 0) +
        Number(article?.Commande_fournisseur || 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg relative">
                {/* Bouton pour fermer le modal */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
                >
                    ✖
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-4">Détails de l&apos;article</h2>
                <div className="space-y-2">
                    <p><strong>Code article :</strong> {article?.Code_Article_MEN85}</p>
                    <p><strong>Description :</strong> {article?.Description_MEN85}</p>
                    <p>
                        <strong>Stock courant :</strong> {article?.Stock_courant !== undefined
                            ? Number(article.Stock_courant).toFixed(2)
                            : "N/A"}
                    </p>
                    <p>
                        <strong>Réservations client :</strong> {article?.Reservation_client !== undefined
                            ? Number(article.Reservation_client).toFixed(2)
                            : "0.00000"}
                    </p>
                    <p>
                        <strong>Commandes fournisseur :</strong> {article?.Commande_fournisseur || 0}
                    </p>
                    <p><strong>Stock minimum :</strong> {article?.Stock_mini}</p>
                    <p><strong>Somme :</strong> {somme.toFixed(2)}</p>
                    <p><strong>Gestion stock :</strong> {article?.Gere_en_stock}</p>
                    <p><strong>Référence fournisseur :</strong> {article?.Reference_fournisseur}</p>
                    <p><strong>Code fournisseur :</strong> {article?.Code_fournisseur}</p>
                    <p><strong>Unité :</strong> {article?.unite}</p>
                </div>
            </div>
        </div>
    );
};

export default Modalarticle;
