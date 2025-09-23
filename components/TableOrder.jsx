"use client";

import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColumnsOrder } from "@/components/ColumnsOrderFourn";
import LoaderTable from "./LoaderTable";

// Fonction pour regrouper les données et sélectionner la date la plus éloignée
const processOrderData = (orderData) => {
  const groupedData = {};
  const occurrenceMap = {};

  // Étape 1 : Comptez les occurrences de chaque numéro de commande
  orderData.forEach((order) => {
    const { numero } = order;
    occurrenceMap[numero] = (occurrenceMap[numero] || 0) + 1;
  });

  // Étape 2 : Regroupez les données par numéro et sélectionnez la date la plus proche
  orderData.forEach((order) => {
    const { numero, dateconf } = order;

    if (!groupedData[numero]) {
      groupedData[numero] = {
        ...order,
        hasMultipleSimilar: occurrenceMap[numero] > 1, // Indique s'il y a plusieurs lignes pour ce numéro
        totalLines: occurrenceMap[numero], // Nombre total de lignes pour ce numéro
      };
    } else {
      const existingDate = new Date(groupedData[numero].dateconf);
      const currentDate = new Date(dateconf);

      // Mise à jour si une date plus proche est trouvée
      if (currentDate < existingDate) {
        groupedData[numero] = {
          ...order,
          hasMultipleSimilar: occurrenceMap[numero] > 1,
          totalLines: occurrenceMap[numero], // Nombre total de lignes pour ce numéro
        };
      }
    }
  });

  return Object.values(groupedData); // Retourne les données regroupées sous forme de tableau
};



const TableOrder = ({ data, orderData, nestedTableData = {} }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2000,
  });

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [articlesData, setArticlesData] = useState({});
  const [loadingArticles, setLoadingArticles] = useState({});
  const [selectedFournisseur, setSelectedFournisseur] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedDateConf, setSelectedDateConf] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    if (orderData && Array.isArray(orderData)) {
      const groupedData = processOrderData(orderData);
      console.log("Données traitées avec astérisque :", groupedData);
      setProcessedData(groupedData);
    }
  }, [orderData]);


  const columns = getColumnsOrder(data);

  // ✅ Réinitialise tous les filtres
  const resetFilters = () => {
    setColumnFilters([]);      // ✅ Réinitialise les filtres
    setSorting([]);            // ✅ Réinitialise le tri
    setFilterInput("");        // ✅ Vide le champ de recherche
    setSelectedFournisseur("");  // ✅ Réinitialise le filtre fournisseur
    setSelectedStatut("");       // ✅ Réinitialise le filtre statut
    setSelectedDateConf("");     // ✅ Réinitialise le filtre date
  
    table.setColumnFilters([]);  // ✅ Réinitialise les filtres de la table
    table.resetSorting();        // ✅ Réinitialise le tri dans la table
    table.resetColumnFilters();  // ✅ Réinitialise les colonnes filtrées
  };
  


    // 📌 1. Déplace cette fonction AVANT useReactTable
    const customDateFilter = (row, columnId, filterValue) => {
      const rawDate = row.getValue(columnId);
    
      // ✅ Si "PAS DE DATE" est sélectionné, on filtre les dates de l'année 1899 ou les dates nulles
      if (filterValue === "1899-11-30" || filterValue === "PAS DE DATE") {
        return (
          !rawDate ||                                   // ✅ Date vide
          rawDate === "0000-00-00" ||                  // ✅ Date non définie
          new Date(rawDate).getFullYear() === 1899     // ✅ Toute date de l'année 1899
        );
      }
    
      // ✅ Filtre classique pour les autres dates
      if (rawDate) {
        const formattedRowDate = new Date(rawDate).toISOString().split("T")[0];
        return formattedRowDate === filterValue;
      }
    
      return false;  // 🔴 Si aucune date valide
    };


  // 📌 2. Configuration du tableau
  const table = useReactTable({
    data: processedData, // Utilise les données regroupées
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    filterFns: {
      dateconf: customDateFilter,  // ✅ Activation du filtre personnalisé
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  const handleFilterChange = (e) => {
    const value = e.target.value || "";
    setFilterInput(value);
    table.setColumnFilters([{ id: "numero", value }]);
  };

  const toggleRowExpansion = (rowId, numeroCommande) => {
    setExpandedRowId((prev) => (prev === rowId ? null : rowId));
    if (!articlesData[numeroCommande]) {
      fetchArticles(numeroCommande);
    }
  };

  const fetchArticles = async (numeroCommande) => {
    setLoadingArticles((prev) => ({ ...prev, [numeroCommande]: true }));
    try {
      const response = await fetch(`http://192.168.1.18:4000/commande/articles/${numeroCommande}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des articles.");
      const data = await response.json();
      const filteredData = data.filter((article) => article.numcom === numeroCommande);
      setArticlesData((prev) => ({ ...prev, [numeroCommande]: filteredData }));
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoadingArticles((prev) => ({ ...prev, [numeroCommande]: false }));
    }
  };
  

  const hasLateOrIncompleteArticles = (numeroCommande) => {
    const articles = articlesData[numeroCommande]?.filter(
      (article) => article.numcom === numeroCommande
    ) || [];
    return articles.some((article) => {
      const quantiteCommandee = parseFloat(article.qtecdee) || 0;
      const quantiteRecue = parseFloat(article.qterecue) || 0;
      const dateConfValide = article.dateconf && !isNaN(new Date(article.dateconf));
      const dateConfirmation = dateConfValide ? new Date(article.dateconf) : null;
  
      return (
        (quantiteRecue === 0 || quantiteRecue < quantiteCommandee) &&
        dateConfirmation &&
        dateConfirmation < new Date()
      );
    });
  };  

  const areAllArticlesReceivedOnTime = (numeroCommande) => {
    const articles = articlesData[numeroCommande] || [];
    return articles.length > 0 && articles.every((article) => {
      const quantiteCommandee = parseFloat(article.qtecdee) || 0;
      const quantiteRecue = parseFloat(article.qterecue) || 0;
      const dateConfValide = article.dateconf && !isNaN(new Date(article.dateconf));
      const dateConfirmation = dateConfValide ? new Date(article.dateconf) : null;

      return (
        quantiteCommandee === quantiteRecue &&
        dateConfirmation &&
        dateConfirmation <= new Date()
      );
    });
  };

  // 📌 Fonction pour exporter les données en CSV
  const exportToCSV = () => {
    if (!processedData.length) {
      console.warn("Aucune donnée à exporter.");
      return;
    }
  
    // 📌 Récupère la configuration des colonnes depuis `getColumnsOrder`
    const columns = getColumnsOrder(processedData);
  
    // 🏷️ Extraction des en-têtes (accessorKey pour éviter JSX)
    const headers = columns.map(col => col.accessorKey || "Colonne");
  
    // 📌 Conversion des données avec encodage UTF-8 et séparation correcte
    const csvContent = [
      headers.join(";"), // ✅ Ajoute les en-têtes
  
      ...processedData.map(row => {
        return columns.map(col => {
          let value = row[col.accessorKey]; // ✅ Récupère la donnée brute
  
          if (col.accessorKey === "dateconf" || col.accessorKey === "datelivr") {
            value = value && value !== "0000-00-00" ? new Date(value).toLocaleDateString("fr-FR") : "PAS DE DATE"; // ✅ Formate les dates
          }
  
          if (col.accessorKey === "histo") {
            value = Number(value) === 1 ? "Réceptionné" : "Non Réceptionné"; // ✅ Remplace les valeurs 0/1
          }
  
          if (typeof value === "string") {
            value = value.replace(/;/g, ",").trim(); // ✅ Évite les conflits avec le séparateur CSV
          }
  
          return value || ""; // ✅ Si null ou undefined, mettre une valeur vide
        }).join(";");
      })
    ].join("\n");
  
    // 📂 Création du fichier CSV en UTF-8
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `export_commandes_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  

  const renderNestedTable = (rowData) => {
    const numeroCommande = rowData.numero;
    const articles = (articlesData[numeroCommande] || []).filter(
      (article) => article.numcom === numeroCommande
    );
    const isLoading = loadingArticles[numeroCommande];

    const attachments = rowData.attachment_paths
      ? rowData.attachment_paths.split(", ").map((filePath) =>
          filePath.replace(".\\Attachments", "http://192.168.1.18:4000/attachments").replace(/\\/g, "/")
        )
      : [];

    return (
      <div className="p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold text-lg mb-3">📎 Pièces jointes :</h3>
        {attachments.length ? (
          <ul className="list-disc ml-6 space-y-2">
            {attachments.map((file, index) => (
              <li key={index}>
                <a
                  href={encodeURI(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {file.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucune pièce jointe disponible.</p>
        )}

        <h3 className="font-semibold text-lg mt-6 mb-3">🛒 Articles de la commande :</h3>
        {isLoading ? (
          <p>Chargement des articles...</p>
        ) : articles.length ? (
          <Table className="w-full bg-white border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>📦 N° Commande</TableHead>
                <TableHead>🔢 Ligne</TableHead>
                <TableHead>📄 Référence Article</TableHead>
                <TableHead>📝 Désignation</TableHead>
                <TableHead>📥 Qté Commandée</TableHead>
                <TableHead>📦 Qté Reçue</TableHead>
                <TableHead>💰 Prix d&apos;Achat (€)</TableHead>
                <TableHead>✅ Prix Confirmé (€)</TableHead>
                <TableHead>📅 Date de Confirmation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article, index) => {
                const quantiteCommandee = parseFloat(article.qtecdee) || 0;
                const quantiteRecue = parseFloat(article.qterecue) || 0;

                const dateConfValide = article.dateconf && !isNaN(new Date(article.dateconf));
                const dateConfirmation = dateConfValide ? new Date(article.dateconf) : null;

                // ✅ Condition : Quantité commandée = reçue ET date valide (ligne verte)
                const isReceivedOnTime =
                  quantiteCommandee === quantiteRecue &&
                  dateConfirmation &&
                  dateConfirmation <= new Date();

                  // ✅ Condition : Quantité reçue = 0 ET date de confirmation NON dépassée (ligne violette)
                  const isPendingReception =
                  (quantiteRecue === 0 &&
                    dateConfirmation &&
                    dateConfirmation >= new Date()) ||
                  !dateConfValide;  // 🟣 Ajout : PAS CONFIRMÉE → Violet

                // ✅ Condition : Quantité reçue = 0 OU inférieure à la quantité commandée ET date de confirmation dépassée (ligne rouge)
                const isLateAndIncomplete =
                  (quantiteRecue === 0 || quantiteRecue < quantiteCommandee) &&
                  dateConfirmation &&
                  dateConfirmation < new Date();

                // 🔵 Condition : Quantité reçue > quantité commandée (ligne bleue)
                const isOverReceived = quantiteRecue > quantiteCommandee;

                // 🎨 Application des couleurs selon les conditions
                const rowClass = isOverReceived
                  ? "bg-blue-200"   // 🔵 Bleu si plus reçu que commandé 
                  : isReceivedOnTime
                  ? "bg-green-200"  // ✅ Vert si tout est reçu à temps
                  : isPendingReception
                  ? "bg-purple-200" // 🟣 Violet si réception attendue (à la date confirmé)
                  : isLateAndIncomplete
                  ? "bg-red-200"    // 🔴 Rouge si retard ou réception partielle (à la date confirmé)
                  : "";             // ⚪️ Pas de couleur sinon

                return (
                  <TableRow key={index} className={rowClass}>
                  <TableCell>{article.numcom}</TableCell>
                  <TableCell>{article.numligne}</TableCell>
                  <TableCell>{article.article}</TableCell>
                  <TableCell>{article.libelle}</TableCell>
                  <TableCell>{quantiteCommandee}</TableCell>
                  <TableCell>{quantiteRecue}</TableCell>
                  <TableCell>{article.pa}</TableCell>
                  <TableCell>{article.prixconf}</TableCell>
                  <TableCell>
                    {dateConfValide
                      ? (
                        <>
                          {new Date(article.dateconf).toLocaleDateString()}
                          {article.hasMultipleSimilar && <span style={{ color: "red", fontWeight: "bold" }}> *</span>}
                        </>
                      )
                      : "PAS CONFIRMÉE"}
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">Aucun article pour cette commande.</p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-50 p-5">
      {typeof orderData === "string" ? (
        <LoaderTable />
      ) : (
        <>
        {/* 🔍 Filtres avancés */}
          <div className="mb-4 flex justify-center items-center gap-6">
            {/* Filtre par Fournisseurs */}
            <select
              value={selectedFournisseur}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedFournisseur(value);  // ✅ Met à jour la sélection
                table.setColumnFilters((prev) => [
                  ...prev.filter((filter) => filter.id !== "nom"),
                  ...(value !== "" ? [{ id: "nom", value }] : [])
                ]);
              }}
              className="p-2 border rounded w-64 shadow-sm focus:ring focus:ring-blue-300 text-center"
            >
              <option value="">🏢 Filtrer par fournisseur</option>
              {[...new Set(orderData.map((item) => item.nom))].map((fournisseur, index) => (
                <option key={index} value={fournisseur}>
                  {fournisseur}
                </option>
              ))}
            </select>


            {/* Filtre par Référence */}
            <input
              type="text"
              placeholder="🔍 Rechercher par référence exacte"
              value={filterInput}
              onChange={(e) => {
                const value = e.target.value.trim();
                setFilterInput(value);

                table.setColumnFilters((prev) => [
                  ...prev.filter((filter) => filter.id !== "remarque"),
                  ...(value !== "" 
                    ? [{
                        id: "remarque",
                        value,
                        filterFn: (row, columnId, filterValue) => {
                          // ✅ Recherche strictement exacte insensible à la casse
                          return row.getValue(columnId)?.toLowerCase() === filterValue.toLowerCase();
                        },
                      }]
                    : []),
                ]);
              }}
              className="p-2 border rounded w-64 shadow-sm focus:ring focus:ring-blue-300 text-center"
            />

            {/* Filtre par Statut */}
            <select
              value={selectedStatut}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedStatut(value);  // ✅ Met à jour la sélection
                table.setColumnFilters((prev) => [
                  ...prev.filter((filter) => filter.id !== "histo"),
                  ...(value !== "" ? [{ id: "histo", value: Number(value) }] : [])
                ]);
              }}
              className="p-2 border rounded w-64 shadow-sm focus:ring focus:ring-blue-300 text-center"
            >
              <option value="">📦 Filtrer par statut</option>
              <option value="1">✅ Réceptionné</option>
              <option value="0">❌ Non Réceptionné</option>
            </select>


           {/* 📅 Filtre par Date de Confirmation */}
           <select
            value={selectedDateConf}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedDateConf(value);  // ✅ Met à jour la sélection
              table.setColumnFilters((prev) => [
                ...prev.filter((filter) => filter.id !== "dateconf"),
                ...(value !== "" ? [{ id: "dateconf", value }] : []),
              ]);
            }}
            className="p-2 border rounded w-64 shadow-sm focus:ring focus:ring-blue-300 text-center"
          >
            <option value="">📅 Filtrer par date de confirmation</option>
            {[...new Set(
              table.getFilteredRowModel().rows
                .filter((row) => row.original.dateconf && row.original.dateconf !== "0000-00-00")
                .map((row) => {
                  const date = new Date(row.original.dateconf);
                  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                  return formattedDate === "1899-11-30" ? "PAS DE DATE" : formattedDate;
                })
            )]
              .sort()
              .map((date, index) => (
                <option key={index} value={date === "PAS DE DATE" ? "1899-11-30" : date}>
                  {date === "PAS DE DATE" ? "PAS DE DATE" : date.split("-").reverse().join("/")}
                </option>
            ))}
          </select>

            {/* 🔄 Bouton pour réinitialiser tous les filtres */}
            <button
              onClick={resetFilters}
              className="p-2 bg-red-500 text-white rounded shadow-sm hover:bg-red-600 transition"
            >
              ♻️ Réinitialiser les filtres
            </button>


            {/* 📥 Bouton d'export CSV */}
            <button
              onClick={exportToCSV}
              className="p-2 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 transition"
            >
              📥 Exporter en CSV
            </button>



          </div>
          <div className={`rounded-md border ${orderData.length >= 10 ? "max-h-[700px] overflow-y-auto" : ""}`}>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead className="px-1" key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const isReceived = row.original.histo === 1;

                    // ✅ Vérifie si la date de confirmation est valide et différente de 1899-11-30
                    const hasValidDateConf = row.original.dateconf &&
                      row.original.dateconf !== "0000-00-00" &&
                      new Date(row.original.dateconf).toLocaleDateString() !== "30/11/1899";

                    const isLate = hasValidDateConf && new Date(row.original.dateconf) < new Date();
                    const isPending = hasValidDateConf && new Date(row.original.dateconf) >= new Date();

                    // ✅ Condition : Date non communiquée (1899-11-30 ou absente)
                    const isNoDate = !hasValidDateConf;

                    // 🎨 Application des couleurs selon les conditions
                    const rowClass = isReceived
                      ? "bg-green-200"  // 🟢 Réceptionné
                      : isLate
                      ? "bg-red-200"    // 🔴 Non réceptionné et date dépassée (à la date confirmé)
                      : isPending || isNoDate
                      ? "bg-purple-200" // 🟣 Non réceptionné mais dans les délais ou PAS DE DATE (à la date confirmé)
                      : "";             // ⚪️ Pas de couleur sinon

                    return (
                      <React.Fragment key={row.id}>
                        <TableRow
                          className={`border-slate-500 border-solid border-y-2 hover:bg-sky-200 cursor-pointer ${rowClass}`}
                          onClick={() => toggleRowExpansion(row.id, row.original.numero)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell className="px-1 text-base" key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>

                        {expandedRowId === row.id && (
                          <TableRow className="bg-gray-100" key={`expanded-${row.id}`}>
                            <TableCell colSpan={columns.length}>
                              <div className="p-4">{renderNestedTable(row.original)}</div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Aucun résultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

        </>
      )}
    </div>
  );  
};

export default TableOrder;
