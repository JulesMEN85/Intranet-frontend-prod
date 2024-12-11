'use client'

import React, { useState } from 'react';
import axios from 'axios';
import Modalarticle from "@/components/Modalarticle";

const TableArticle = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [filters, setFilters] = useState({
        articleCode: '',
        stockManagement: '',
        supplierRef: '',
        supplierCode: '',
        stockStatus: '',
    });

    const openModal = (article) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setSelectedArticle(null);
        setIsModalOpen(false);
    };
    
    const letters = ["A", "C", "K", "M", "N", "P", "Q", "S", "V"];

    // Gérer la sélection/dé-sélection des lettres
    const toggleLetter = (letter) => {
        const updatedLetters = selectedLetters.includes(letter)
            ? selectedLetters.filter((l) => l !== letter) // Supprime la lettre si elle est déjà sélectionnée
            : [...selectedLetters, letter]; // Ajoute la lettre si elle n'est pas sélectionnée
    
        setSelectedLetters(updatedLetters);
        handleLoadArticles(filters, updatedLetters); // Charger les articles avec les lettres mises à jour
    };
    
    const handleFilterChange = (key, value) => {
        // Validation stricte : seuls les chiffres exacts sont autorisés
        const exactNumber = /^\d+$/; // S'assure que seule une séquence de chiffres est permise
        if (key === 'supplierCode' && value !== '' && !exactNumber.test(value)) {
            return; // Ne met pas à jour si la saisie n'est pas strictement un nombre
        }
    
        // Mettre à jour les filtres
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    
        // Charger les articles uniquement si la saisie est correcte
        handleLoadArticles({ ...filters, [key]: value });
    };

    // Charger les articles avec les lettres sélectionnées et les filtres
    const handleLoadArticles = async (updatedFilters = filters, updatedLetters = selectedLetters) => {
        // Si aucune lettre n'est sélectionnée, ne pas charger les articles
        if (updatedLetters.length === 0) {
            setData([]); // Vide les données affichées
            return;
        }
    
        setLoading(true);
    
        try {
            const exactNumber = /^\d+$/; // Validation stricte pour supplierCode
            const validSupplierCode = exactNumber.test(updatedFilters.supplierCode)
                ? updatedFilters.supplierCode
                : null;
    
            const response = await axios.get(`/api/articles`, {
                params: {
                    letters: updatedLetters.join(","),
                    articleCode: updatedFilters.articleCode,
                    stockManagement: updatedFilters.stockManagement,
                    supplierRef: updatedFilters.supplierRef,
                    supplierCode: validSupplierCode,
                    stockStatus: updatedFilters.stockStatus,
                },
            });
    
            if (updatedFilters.stockStatus === "low") {
                // Stock insuffisant (rouge)
                const filteredData = response.data.data.filter(
                    (item) => item.Stock_courant < item.Stock_mini
                );
                setData(filteredData);
            } else if (updatedFilters.stockStatus === "near") {
                // Stock proche du minimum (orange)
                const filteredData = response.data.data.filter(
                    (item) =>
                        item.Stock_mini > 0 &&
                        item.Stock_courant >= item.Stock_mini &&
                        item.Stock_courant <= item.Stock_mini * 1.1
                );
                setData(filteredData);
            } else if (updatedFilters.stockStatus === "reserved") {
                // Stock courant à 0 mais réservations client > 0 (violet)
                const filteredData = response.data.data.filter(
                    (item) => item.Stock_courant === 0 && item.Reservation_client > 0
                );
                setData(filteredData);
            } else {
                // Tous les articles ou autres filtres
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des articles :", error);
        } finally {
            setLoading(false);
        }
    };
    

    const downloadCSV = () => {
        if (!data.length) return; // Pas de données, pas de téléchargement
    
        const csvHeaders = [
            "  Code Article  ",
            "  Description  ",
            "  Stock Courant  ",
            "  Réservations Client  ",
            "  Commandes Fournisseur  ",
            "  Stock Minimum  ",
            "  Somme  ",
            "  Gestion Stock  ",
            "  Référence Fournisseur  ",
            "  Code Fournisseur  ",
        ];
    
        const csvRows = data.map((item) => [
            `  ${item.Code_Article_MEN85}  `,
            `  ${item.Description_MEN85}  `,
            `  ${item.Stock_courant}  `,
            `  ${item.Reservation_client || 0}  `,
            `  ${item.Commande_fournisseur || 0}  `,
            `  ${item.Stock_mini}  `,
            `  ${(
                (item.Stock_courant || 0) -
                (item.Reservation_client || 0) +
                (item.Commande_fournisseur || 0)
            ).toFixed(3)}  `,
            `  ${item.Gere_en_stock}  `,
            `  ${item.Reference_fournisseur}  `,
            `  ${item.Code_fournisseur}  `,
        ]);
    
        const csvContent = [
            csvHeaders.join(";"),
            ...csvRows.map((row) => row.join(";")),
        ].join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "tableau_articles.csv";
        link.click();
    };
    
    
    
    
    
    
    return (
        <div className="space-y-6">
            {/* Card des filtres */}
            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <h2 className="text-md font-medium text-gray-900 mb-2">Filtres</h2>

                {/* Conteneur principal */}
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Lettres sur une ligne */}
                    <div className="flex flex-wrap gap-2">
                        {letters.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => toggleLetter(letter)}
                                className={`px-2 py-1 rounded-md transition duration-300 ease-in-out transform ${
                                    selectedLetters.includes(letter)
                                        ? "bg-sky-700 text-white shadow-lg"
                                        : "bg-sky-950 text-white hover:bg-sky-700 hover:translate-y-1 hover:shadow-md hover:shadow-sky-500"
                                }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                    {/* Filtres sur la même ligne */}
                    <input
                        type="text"
                        placeholder="Code article (ex : QP)"
                        value={filters.articleCode}
                        onChange={(e) => handleFilterChange('articleCode', e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    />
                    <select
                        value={filters.stockManagement}
                        onChange={(e) => handleFilterChange('stockManagement', e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    >
                        <option value="">Gestion</option>
                        <option value="OUI">OUI</option>
                        <option value="NON">NON</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Référence fournisseur"
                        value={filters.supplierRef}
                        onChange={(e) => handleFilterChange('supplierRef', e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    />
                    <input
                        type="text"
                        placeholder="Code fournisseur"
                        value={filters.supplierCode}
                        onChange={(e) => handleFilterChange('supplierCode', e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    />
                    <select
                        value={filters.stockStatus}
                        onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    >
                        <option value="">Tous les articles</option>
                        <option value="low">Stock insuffisant (rouge)</option>
                        <option value="near">Stock proche du minimum (orange)</option>
                        <option value="reserved">Réservations client mais stock vide (violet)</option>
                    </select>






                    {/* Bouton Réinitialiser */}
                    <button
                        onClick={() => {
                            setFilters({
                                articleCode: '',
                                stockManagement: '',
                                supplierRef: '',
                                supplierCode: '',
                                stockStatus: '',
                            });
                            setSelectedLetters([]); // Réinitialiser les lettres sélectionnées
                            setData([]); // Vide les données affichées
                            handleLoadArticles();
                        }}
                        className="px-2 py-1 bg-sky-950 text-white rounded-md hover:bg-sky-700 w-28 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Réinitialiser
                    </button>
                </div>

                {/* Checkbox sous les lettres */}
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="showAllLetters"
                        checked={selectedLetters.length === letters.length} // Coché si toutes les lettres sont sélectionnées
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            if (isChecked) {
                                setSelectedLetters(letters); // Sélectionner toutes les lettres
                                handleLoadArticles({ ...filters }, letters); // Charger les articles pour toutes les lettres
                            } else {
                                setSelectedLetters([]); // Désélectionner toutes les lettres
                                setData([]); // Vide les données affichées dans le tableau
                            }
                        }}
                        className="w-4 h-4 text-sky-700 bg-gray-100 border-gray-300 rounded focus:ring-sky-700 focus:ring-2"
                    />
                    <label htmlFor="showAllLetters" className="text-sm text-gray-700">
                        Afficher toutes les lettres
                    </label>
                </div>
            </div>




            {/* Tableau des articles */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                        Liste des articles
                        <span className="text-sm text-gray-500 ml-2">
                            ({data.length} {data.length === 1 ? "article" : "articles"})
                        </span>
                    </h2>
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-sky-700 text-white text-sm font-medium rounded-md shadow hover:bg-sky-800 transition"
                    >
                        Exporter en CSV
                    </button>
                </div>
                {loading ? (
                    <div className="text-center text-gray-500">Chargement...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="max-h-[600px] overflow-y-auto">
                            <table className="table-fixed w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[100px] truncate">
                                            Code<br />article
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[150px] truncate">
                                            Description
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[80px] truncate">
                                            Stock<br />courant
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[120px] truncate">
                                            Réservations<br />client
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[120px] truncate">
                                            Commandes<br />fournisseur
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[80px] truncate">
                                            Stock<br />minimum
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[100px] truncate">
                                            Somme
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[80px] truncate">
                                            Gestion<br />stock
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[150px] truncate">
                                            Référence<br />fournisseur
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[100px] truncate">
                                            Code<br />fournisseur
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.length > 0 ? (
                                        data.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`
                                                    cursor-pointer 
                                                    ${
                                                        item.Stock_courant === 0 && item.Reservation_client > 0
                                                            ? "bg-purple-200"
                                                            : item.Stock_courant < item.Stock_mini
                                                            ? "bg-red-200"
                                                            : item.Stock_courant >= item.Stock_mini &&
                                                            item.Stock_courant <= item.Stock_mini * 1.1
                                                            ? "bg-orange-200"
                                                            : ""
                                                    }
                                                `}
                                                onClick={() => openModal(item)}
                                            >
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Code_Article_MEN85}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Description_MEN85}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Stock_courant}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Reservation_client || 0}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Commande_fournisseur || 0}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Stock_mini}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {(
                                                        (item.Stock_courant || 0) -
                                                        (item.Reservation_client || 0) +
                                                        (item.Commande_fournisseur || 0)
                                                    ).toFixed(3)}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Gere_en_stock}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Reference_fournisseur}
                                                </td>
                                                <td className="px-2 py-2 text-sm text-gray-800 truncate">
                                                    {item.Code_fournisseur}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="px-2 py-2 text-center text-gray-500">
                                                Aucun article disponible.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Modal placé ici */}
                        <Modalarticle
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            article={selectedArticle}
                        />
                    </div>
                )}
            </div>

        </div>
    );
};

export default TableArticle;
