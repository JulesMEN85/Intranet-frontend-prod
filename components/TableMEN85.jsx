import {
  Table as TableComponent,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { CSVLink } from "react-csv"; // Importer react-csv pour l'export CSV

// Fonction pour formater les nombres avec un espace insécable pour les milliers
const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return number
    .toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/\s/g, '\u00A0'); // Remplace les espaces normaux par des espaces insécables
};

const TableMEN85 = ({ data }) => {
  // Calcul des totaux pour `totalHT_cdes_jour`
  const totalCDE = data.reduce(
    (accumulator, currentValue) => (currentValue['totalHT_cdes_jour'] ? accumulator + currentValue['totalHT_cdes_jour'] : accumulator),
    0
  );

  // Préparation des données pour l'export CSV
  const exportData = data.map((row) => ({
    Mois: new Date(row.DATE).toLocaleDateString("fr-FR", { month: "long" }),
    Jour: new Date(row.DATE).toLocaleDateString("fr-FR"),
    "CA CDE HT": row['totalHT_cdes_jour'] ? formatNumber(row['totalHT_cdes_jour']) : 0,
  }));

  // Ajouter une ligne pour le total
  exportData.push({
    Mois: "Total",
    Jour: "",
    "CA CDE HT": formatNumber(totalCDE),
  });

  const headers = [
    { label: "Mois", key: "Mois" },
    { label: "Jour", key: "Jour" },
    { label: "CA CDE HT", key: "CA CDE HT" },
  ];

  return (
    <div>
      {/* Bouton d'exportation */}
      <div className="mb-4 flex justify-start">
        <CSVLink
          data={exportData}
          headers={headers}
          separator=";" // Utilisation du séparateur pour assurer la compatibilité avec Excel en français
          filename={`export_MEN85_${new Date().toISOString()}.csv`}
          className="bg-cyan-800 text-cyan-50 px-4 py-2 rounded"
        >
          Exporter en CSV
        </CSVLink>
      </div>
      <TableComponent>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Jour</TableHead>
            <TableHead>CA CDE HT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((dayRow, index) => (
            <TableRow key={`${dayRow.DATE}-${index}`}>
              <TableCell>{new Date(dayRow.DATE).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                {dayRow['totalHT_cdes_jour'] !== undefined && dayRow['totalHT_cdes_jour'] !== null && !isNaN(parseFloat(dayRow['totalHT_cdes_jour'])) 
                  ? formatNumber(parseFloat(dayRow['totalHT_cdes_jour'])) 
                  : 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>{formatNumber(parseFloat(totalCDE))}</TableCell>
          </TableRow>
        </TableFooter>
      </TableComponent>
    </div>
  );
};

export default TableMEN85;
