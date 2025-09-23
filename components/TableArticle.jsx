"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modalarticle from "@/components/Modalarticle";

const TableArticle = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [filters, setFilters] = useState({
        articleCode: "",
        stockManagement: "",
        supplierRef: "",
        supplierCode: "",
        stockStatus: "",
        unit: "", 
    });    
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");

    const openModal = (article) => {
        console.log("Ouverture du modal pour l'article :", article);
        setSelectedArticle(article);
        setIsModalOpen(true);
    };
    

    const closeModal = () => {
        console.log("Fermeture du modal");
        setSelectedArticle(null);
        setIsModalOpen(false);
    };
    

    const letters = ["A", "C", "K", "M", "N", "P", "Q", "S", "V"];

    const toggleLetter = (letter) => {
        const updatedLetters = selectedLetters.includes(letter)
            ? selectedLetters.filter((l) => l !== letter)
            : [...selectedLetters, letter];

        setSelectedLetters(updatedLetters);
        handleLoadArticles(filters, updatedLetters);
    };

    const handleFilterChange = (key, value) => {
        const exactNumber = /^\d+$/;
        if (key === "supplierCode" && value !== "" && !exactNumber.test(value)) {
            return;
        }

        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));

        handleLoadArticles({ ...filters, [key]: value });
    };

    const handleLoadArticles = async (updatedFilters = filters, updatedLetters = selectedLetters) => {
        if (updatedLetters.length === 0) {
            setData([]);
            return;
        }
    
        setLoading(true);
    
        try {
            const exactNumber = /^\d+$/;
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
    
            let articles = response.data.data;
    
            // ➡️  Appliquer automatiquement les couleurs dès le chargement
            articles = articles.map((item) => {
                const somme =
                    Number(item.Stock_courant || 0) -
                    Number(item.Reservation_client || 0) +
                    Number(item.Commande_fournisseur || 0);
    
                let colorClass = "bg-white"; // Couleur par défaut
    
                if (item.Reservation_client > 0 && somme <= 0) {
                    colorClass = "bg-purple-200"; // Violet : Réservation client > 0 et stock épuisé
                } else if (somme < item.Stock_mini) {
                    colorClass = "bg-red-200"; // Rouge : Stock insuffisant
                } else if (somme >= item.Stock_mini && somme <= item.Stock_mini * 1.1) {
                    colorClass = "bg-orange-200"; // Orange : Stock proche du minimum
                }
    
                return { ...item, colorClass }; // 🔄 Ajout de la classe de couleur
            });
    
            // ➡️  Appliquer les filtres sélectionnés (low, near, reserved)
            if (updatedFilters.stockStatus === "low") {
                // 🔴 Rouge : Stock courant < Stock mini
                articles = articles.filter((item) => {
                    const somme =
                        Number(item.Stock_courant || 0) -
                        Number(item.Reservation_client || 0) +
                        Number(item.Commande_fournisseur || 0);
                    return somme < item.Stock_mini;
                });
            } else if (updatedFilters.stockStatus === "near") {
                // 🟠 Orange : Stock mini <= Stock courant <= 1.1 * Stock mini
                articles = articles.filter((item) => {
                    const somme =
                        Number(item.Stock_courant || 0) -
                        Number(item.Reservation_client || 0) +
                        Number(item.Commande_fournisseur || 0);
                    return somme >= item.Stock_mini && somme <= item.Stock_mini * 1.1;
                });
            } else if (updatedFilters.stockStatus === "reserved") {
                // 🟣 Violet : Réservation client > 0 et somme <= 0
                articles = articles.filter((item) => {
                    const somme =
                        Number(item.Stock_courant || 0) -
                        Number(item.Reservation_client || 0) +
                        Number(item.Commande_fournisseur || 0);
                    return item.Reservation_client > 0 && somme <= 0;
                });
            }
    
            // ➡️  Extraction des fournisseurs uniques
            const uniqueSuppliers = Array.from(
                new Set(articles.map((item) => item.Code_fournisseur))
            );
            setSuppliers(uniqueSuppliers);
    
            // ➡️  Filtre par fournisseur si sélectionné
            if (selectedSupplier) {
                articles = articles.filter(
                    (item) => item.Code_fournisseur === selectedSupplier
                );
            }
    
            setData(articles);
        } catch (error) {
            console.error("Erreur lors de la récupération des articles :", error);
        } finally {
            setLoading(false);
        }
    };
    
    

    useEffect(() => {
        handleLoadArticles(filters, selectedLetters);
    }, [selectedSupplier, filters, selectedLetters]);    

    const downloadCSV = () => {
        if (!data.length) return;

        const csvHeaders = [
            "Code Article",
            "Description",
            "Stock Courant",
            "Réservations Client",
            "Commandes Fournisseur",
            "Stock Minimum",
            "Somme",
            "Gestion Stock",
            "Référence Fournisseur",
            "Code Fournisseur",
            "Unité", 
        ];
        
        const csvRows = data.map((item) => [
            `${item.Code_Article_MEN85}`,
            `${item.Description_MEN85}`,
            `${Number(item.Stock_courant).toFixed(2)}`,
            `${Number(item.Reservation_client || 0).toFixed(2)}`,
            `${item.Commande_fournisseur || 0}`,
            `${item.Stock_mini}`,
            `${(
                (item.Stock_courant || 0) - 
                (item.Reservation_client || 0) + 
                (item.Commande_fournisseur || 0)
            ).toFixed(2)}`,
            `${item.Gere_en_stock}`,
            `${item.Reference_fournisseur}`,
            `${item.Code_fournisseur}`,
            `${item.Unite}`, // Ajout de l'unité
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
            <div className="bg-white shadow rounded-lg p-4 mb-4 max-w-full overflow-x-auto">
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
                        onChange={(e) => handleFilterChange("articleCode", e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    />
                    <select
                        value={filters.stockManagement}
                        onChange={(e) => handleFilterChange("stockManagement", e.target.value)}
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
                        onChange={(e) => handleFilterChange("supplierRef", e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    />
                    <input
                        type="text"
                        placeholder="Code fournisseur"
                        value={filters.supplierCode}
                        onChange={(e) => handleFilterChange("supplierCode", e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    />
                    <select
                        value={filters.stockStatus}
                        onChange={(e) => handleFilterChange("stockStatus", e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    >
                        <option value="">Tous les articles</option>
                        <option value="low">Stock insuffisant (rouge)</option>
                        <option value="near">Stock proche du minimum (orange)</option>
                        <option value="reserved">Réservations client mais stock vide (violet)</option>
                    </select>

                    {/* Filtre Fournisseurs */}
                    <select
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring focus:ring-sky-700 w-36"
                    >
                        <option value="">Tous les fournisseurs</option>
                        {suppliers
                            .slice()
                            .sort((a, b) => a - b)
                            .map((supplier) => (
                                <option key={supplier} value={supplier}>
                                    {supplier}
                                </option>
                            ))}
                    </select>

                    {/* Bouton Réinitialiser */}
                    <button
                        onClick={() => {
                            setFilters({
                                articleCode: "",
                                stockManagement: "",
                                supplierRef: "",
                                supplierCode: "",
                                stockStatus: "",
                            });
                            setSelectedLetters([]);
                            setSelectedSupplier("");
                            setData([]);
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
                        checked={selectedLetters.length === letters.length}
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            if (isChecked) {
                                setSelectedLetters(letters);
                                handleLoadArticles({ ...filters }, letters);
                            } else {
                                setSelectedLetters([]);
                                setData([]);
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
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[80px] truncate">
                                    Code<br />article
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[300px] truncate">
                                    Description
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[70px] truncate">
                                    Stock<br />courant
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[100px] truncate">
                                    Réservations<br />client
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[100px] truncate">
                                    Commandes<br />fournisseur
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[70px] truncate">
                                    Stock<br />minimum
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[80px] truncate">
                                    Somme
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[70px] truncate">
                                    Gestion<br />stock
                                </th>        
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[80px] truncate">
                                    Unité
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[300px] truncate">
                                    Référence<br />fournisseur
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase w-[80px] truncate">
                                    Code<br />fournisseur
                                </th>

                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item, index) => {
                                const somme =
                                    Number(item.Stock_courant || 0) -
                                    Number(item.Reservation_client || 0) +
                                    Number(item.Commande_fournisseur || 0);

                                // Définir la classe basée sur les priorités
                                const rowClass =
                                    filters.stockStatus === "reserved" && item.Reservation_client > 0 && somme <= 0
                                        ? "bg-purple-200" // Violet
                                        : filters.stockStatus === "low" && somme < item.Stock_mini
                                        ? "bg-red-200" // Rouge
                                        : filters.stockStatus === "near" &&
                                        somme >= item.Stock_mini &&
                                        somme <= item.Stock_mini * 1.1
                                        ? "bg-orange-200" // Orange
                                        : "bg-white"; // Par défaut




                                return (
                                    <tr
                                        key={index}
                                        className={`cursor-pointer ${rowClass}`}
                                        onClick={() => openModal(item)}
                                    >
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Code_Article_MEN85}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Description_MEN85}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Stock_courant !== undefined
                                                ? Number(item.Stock_courant).toFixed(2)
                                                : "N/A"}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Reservation_client !== undefined
                                                ? Number(item.Reservation_client).toFixed(2)
                                                : "0.00000"}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Commande_fournisseur || 0}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {Number(item.Stock_mini).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {somme.toFixed(2)}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Gere_en_stock}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Unite || "N/A"}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Reference_fournisseur}
                                        </td>
                                        <td className="px-2 py-2 text-sm text-gray-800 truncate hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200">
                                            {item.Code_fournisseur}
                                        </td>
                                    </tr>
                                );
    })}
</tbody>

                        </table>
                    </div>
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
