import { Button } from "@/components/ui/button";
import { FaSortNumericDown, FaCalendarAlt, FaClipboard, FaUserTie, FaTruck } from "react-icons/fa";

export const getColumnsOrder = (data) => {
  return [
    {
      accessorKey: "numero",
      header: ({ column }) => (
        <Button
          className="px-0 flex items-center gap-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <FaSortNumericDown /> Numéro
        </Button>
      ),
    },
    {
      accessorKey: "datelivr",
      header: ({ column }) => (
        <Button
          className="px-0 flex items-center gap-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <FaCalendarAlt /> Date Délais Souhaité
        </Button>
      ),
      cell: ({ row }) => <div>{new Date(row.getValue("datelivr")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "dateconf",
      header: ({ column }) => (
        <Button
          className="px-0 flex items-center gap-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <FaCalendarAlt /> Date Confirmée
        </Button>
      ),
      cell: ({ row }) => {
        const dateConf = row.getValue("dateconf");
        const isInvalidDate = !dateConf || dateConf === "0000-00-00" || new Date(dateConf).toLocaleDateString() === "30/11/1899";
        const hasMultipleSimilar = row.original.hasMultipleSimilar; // Vérifie si l'astérisque doit apparaître
        
        return (
          <div className="flex items-center gap-1">
            {isInvalidDate ? (
              "PAS DE DATE"
            ) : (
              <>
                {new Date(dateConf).toLocaleDateString("fr-FR")} {/* Format FR */}
                {hasMultipleSimilar && <span className="text-red-600 font-bold">*</span>} {/* Ajout de l'astérisque */}
              </>
            )}
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const rawDate = row.getValue(columnId);

        if (!rawDate || rawDate === "0000-00-00" || new Date(rawDate).toLocaleDateString() === "30/11/1899") {
          return false;
        }

        const rowDate = new Date(rawDate);
        const formattedRowDate = `${rowDate.getFullYear()}-${String(rowDate.getMonth() + 1).padStart(2, "0")}-${String(rowDate.getDate()).padStart(2, "0")}`;

        return formattedRowDate === filterValue;
      },
    },
    {
      accessorKey: "remarque",
      header: ({ column }) => (
        <Button
          className="px-0 flex items-center gap-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <FaClipboard /> Référence
        </Button>
      ),
      cell: ({ row }) => <div className="max-w-50 break-words">{row.getValue("remarque")}</div>,
    },
    {
      accessorKey: "nom",
      header: ({ column }) => (
        <Button
          className="px-0 flex items-center gap-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <FaUserTie /> Fournisseurs
        </Button>
      ),
      cell: ({ row }) => <div className="max-w-40 break-words">{row.getValue("nom")}</div>,
    },
    {
      accessorKey: "histo",
      header: ({ column }) => (
        <Button
          className="px-0 flex items-center gap-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <FaTruck /> Statut
        </Button>
      ),
      cell: ({ row }) => (
        <span className={Number(row.getValue("histo")) === 1 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
          {Number(row.getValue("histo")) === 1 ? "Réceptionné" : "Non Réceptionné"}
        </span>
      ),
      filterFn: (row, columnId, filterValue) => {
        return Number(row.getValue(columnId)) === Number(filterValue);
      },
    },
  ];
};
