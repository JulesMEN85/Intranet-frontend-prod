import { Button } from "@/components/ui/button";


export const getColumnsOrder = (data) => {
  return [
    {
      accessorKey: "numero",
      header: ({ column }) => (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Numero
        </Button>
      ),
    },
    {
      accessorKey: "datecde",
      header: ({ column }) => (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date commande
        </Button>
      ),
      cell: ({ row }) => <div>{new Date(row.getValue("datecde")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "datelivr",
      header: ({ column }) => (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date livr souhaitée
        </Button>
      ),
      cell: ({ row }) => <div>{new Date(row.getValue("datelivr")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "remarque",
      header: ({ column }) => (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Remarque
        </Button>
      ),
      cell: ({ row }) => <div className="max-w-50 break-words">{row.getValue("remarque")}</div>,
    },
    {
      accessorKey: "nom",
      header: ({ column }) => (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
        </Button>
      ),
      cell: ({ row }) => <div className="max-w-40 break-words">{row.getValue("nom")}</div>,
    }
  ];
};
