import {
  Table as TableComponent,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
  TableFooter
} from "@/components/ui/table";
import { formatNumber } from "@/utils/formatNumber"; // Fonction pour formater les nombres
import { CSVLink } from "react-csv"; // Utilisation de react-csv pour générer le fichier CSV

const TableBL85 = ({ data }) => {
  // Calcul des totaux pour `totalHT_BL_jour`
  const totalBL = data.reduce(
    (accumulator, currentValue) => (currentValue['totalHT_BL_jour'] ? accumulator + currentValue['totalHT_BL_jour'] : accumulator),
    0
  );

  // Préparation des données pour l'export CSV
  const exportData = data.map((row) => ({
    Mois: new Date(row.DATE).toLocaleDateString("fr-FR", { month: "long" }),
    Jour: new Date(row.DATE).toLocaleDateString("fr-FR"),
    "CA BL HT": row['totalHT_BL_jour'] ? formatNumber(row['totalHT_BL_jour']) : 0
  }));

  // Ajouter une ligne pour le total
  exportData.push({
    Mois: "Total",
    Jour: "",
    "CA BL HT": formatNumber(totalBL)
  });

  const headers = [
    { label: "Mois", key: "Mois" },
    { label: "Jour", key: "Jour" },
    { label: "CA BL HT", key: "CA BL HT" },
  ];

  return (
    <div>
      {/* Bouton d'exportation */}
      <div className="mb-4 flex justify-start">
        <CSVLink
          data={exportData}
          headers={headers}
          separator=";" // Délimiteur pour séparer les colonnes (utile pour Excel en français)
          filename={`export_BL85_${new Date().toISOString()}.csv`}
          className="bg-cyan-800 text-cyan-50 px-4 py-2 rounded"
        >
          Exporter en CSV
        </CSVLink>
      </div>
      <TableComponent>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Jour</TableHead>
            <TableHead>CA BL HT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((dayRow, index) => (
            <TableRow key={`${dayRow.DATE}-${index}`}>
              <TableCell>{new Date(dayRow.DATE).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                {dayRow['totalHT_BL_jour'] !== undefined && dayRow['totalHT_BL_jour'] !== null && !isNaN(parseFloat(dayRow['totalHT_BL_jour'])) 
                  ? formatNumber(parseFloat(dayRow['totalHT_BL_jour'])) 
                  : 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>{formatNumber(parseFloat(totalBL))}</TableCell>
          </TableRow>
        </TableFooter>
      </TableComponent>
    </div>
  );
};

export default TableBL85;
