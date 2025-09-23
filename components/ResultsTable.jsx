"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useState, useMemo } from "react";

// Fonction utilitaire pour formater les nombres
const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return "0.00";
  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

// Fonction pour convertir les données en CSV
const exportToCSV = (data, totals, filename) => {
  const headers = [
    "Client",
    "Nom",
    "PG ALU",
    "PG PVC",
    "Volets ALU",
    "Volets PVC",
    "Portail et Clôture",
    "Motorisation",
    "PS",
    "Persiennes",
    "Divers",
    "Compléments",
    "Escomptes",
    "Avoirs",
    "Total", // Nouvelle colonne
  ];

  // Construire les lignes des données
  const rows = data.map((row) => {
    const total =
      (row.PG_ALU || 0) +
      (row.PG_PVC || 0) +
      (row.Volets_ALU || 0) +
      (row.Volets_PVC || 0) +
      (row.Portail_et_Cloture || 0) +
      (row.Motorisation || 0) +
      (row.PS || 0) +
      (row.Persiennes|| 0) +
      (row.Divers || 0) +
      (row.Complements || 0) +
      (row.Escomptes || 0) +
      (row.Avoirs || 0);

    return [
      row.client,
      row.nom,
      row.PG_ALU || 0,
      row.PG_PVC || 0,
      row.Volets_ALU || 0,
      row.Volets_PVC || 0,
      row.Portail_et_Cloture || 0,
      row.Motorisation || 0,
      row.PS || 0,
      row.Persiennes || 0,
      row.Divers || 0,
      row.Complements || 0,
      row.Escomptes || 0,
      row.Avoirs || 0,
      total, // Ajout du total pour chaque ligne
    ];
  });

  // Ajouter la ligne des totaux
  const totalRow = [
    "-", // Première colonne vide
    "Total", // Indicateur de total
    totals.PG_ALU || 0,
    totals.PG_PVC || 0,
    totals.Volets_ALU || 0,
    totals.Volets_PVC || 0,
    totals.Portail_et_Cloture || 0,
    totals.Motorisation || 0,
    totals.PS || 0,
    totals.Persiennes || 0,
    totals.Divers || 0,
    totals.Complements || 0,
    totals.Escomptes || 0,
    totals.Avoirs || 0,
    // Calcul du total global
    totals.PG_ALU +
      totals.PG_PVC +
      totals.Volets_ALU +
      totals.Volets_PVC +
      totals.Portail_et_Cloture +
      totals.Motorisation +
      totals.PS +
      totals.Persiennes +
      totals.Divers +
      totals.Complements +
      totals.Escomptes +
      totals.Avoirs,
  ];

  rows.push(totalRow);

  // Générer le contenu CSV avec des points-virgules comme séparateurs
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((row) => row.join(";")).join("\n");

  // Télécharger le fichier CSV
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



const ResultsTable = ({ data }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  // Calcul des totaux pour chaque colonne
  const totals = useMemo(() => {
    const initialTotals = {
      PG_ALU: 0,
      PG_PVC: 0,
      Volets_ALU: 0,
      Volets_PVC: 0,
      Portail_et_Cloture: 0,
      Motorisation: 0,
      PS: 0,
      Persiennes: 0,
      Divers: 0,
      Complements: 0,
      Escomptes: 0,
      Avoirs: 0,
    };

    return data.reduce((acc, row) => {
      for (let key in initialTotals) {
        acc[key] += Number(row[key] || 0);
      }
      return acc;
    }, initialTotals);
  }, [data]);

  // Fonction pour gérer la sélection d'une ligne
  const handleRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index); // Toggle la sélection de la ligne
  };

  return (
    <Card className="bg-white rounded-lg shadow-md p-4 flex-1">
      {/* Conteneur pour le titre et le bouton */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold text-gray-800">Résultats</h2>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          onClick={() =>
            exportToCSV(data, totals, "export_table_results.csv")
          }
        >
          Exporter en CSV
        </button>
      </div>


      <div className="relative max-h-96 overflow-y-auto overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              {[
                "Client",
                "Nom",
                "PG ALU",
                "PG PVC",
                "Volets ALU",
                "Volets PVC",
                "Portail et Clôture",
                "Motorisation",
                "PS",
                "Persiennes",
                "Divers",
                "Compléments",
                "Escomptes",
                "Avoirs",
                "Total", // Nouvelle colonne pour le total
              ].map((header) => (
                <th
                  key={header}
                  className="text-center p-2 border-b bg-white z-10 font-normal"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Ligne des totaux */}
            <tr className="bg-gray-100">
              <td className="text-center font-bold p-2 border-b">-</td>
              <td className="text-center font-bold p-2 border-b">Total</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.PG_ALU)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.PG_PVC)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Volets_ALU)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Volets_PVC)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Portail_et_Cloture)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Motorisation)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.PS)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Persiennes)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Divers)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Complements)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Escomptes)}</td>
              <td className="text-center font-bold p-2 border-b">{formatNumber(totals.Avoirs)}</td>
              <td className="text-center font-bold p-2 border-b">
                {formatNumber(
                  totals.PG_ALU +
                    totals.PG_PVC +
                    totals.Volets_ALU +
                    totals.Volets_PVC +
                    totals.Portail_et_Cloture +
                    totals.Motorisation +
                    totals.PS +
                    totals.Persiennes +
                    totals.Divers +
                    totals.Complements +
                    totals.Escomptes +
                    totals.Avoirs
                )}
              </td>
            </tr>
            {/* Données du tableau */}
            {data.map((row, index) => (
              <tr
                key={index}
                className={`cursor-pointer ${
                  selectedRow === index ? "bg-gray-200" : ""
                }`}
                onClick={() => handleRowClick(index)}
              >
                <td className="text-center p-2 border-b">{row.client}</td>
                <td className="text-center p-2 border-b">{row.nom}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.PG_ALU)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.PG_PVC)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Volets_ALU)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Volets_PVC)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Portail_et_Cloture)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Motorisation)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.PS)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Persiennes)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Divers)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Complements)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Escomptes)}</td>
                <td className="text-center p-2 border-b">{formatNumber(row.Avoirs)}</td>
                <td className="text-center p-2 border-b">
                  {formatNumber(
                    (row.PG_ALU || 0) +
                      (row.PG_PVC || 0) +
                      (row.Volets_ALU || 0) +
                      (row.Volets_PVC || 0) +
                      (row.Portail_et_Cloture || 0) +
                      (row.Motorisation || 0) +
                      (row.PS || 0) +
                      (row.Persiennes || 0) +
                      (row.Divers || 0) +
                      (row.Complements || 0) +
                      (row.Escomptes || 0) +
                      (row.Avoirs || 0)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>






      {data.length > 7 && (
        <div className="text-center mt-2 text-sm text-gray-500">
          Défilez pour voir plus de lignes
        </div>
      )}
    </Card>
  );
};

export default ResultsTable;
