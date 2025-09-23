import { Button } from "@/components/ui/button";

export const getColumnsTransport = () => {
  return [
    {//L:\Fabrication\Winpro\Commande fournisseur\202409
      accessorKey: "numcom",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Commande
          </Button>
        )
      },
      cell: ({ row }) => {
        function convertirDate(dateString) {         
          const [jour, mois, annee] = dateString.split("/");
          // Retourner la date au format AAAAMM
          return `${annee}${mois}`;
        }
        const dateOutput = convertirDate(row.getValue("datecde"));
        return (
          <div className="text-center" >
            <a className="underline text-sky-700"
              target="_blank"
              href={`file://192.168.10.2/Grp-Lallemant/Lallemant/Fabrication/Winpro/Commande fournisseur/${dateOutput}/${row.getValue("numcom")} - Commande fournisseur.pdf`}>
              {row.getValue("numcom")}
            </a>
          </div>)
      }
    },
    {
      accessorKey: "datecde",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date commande
          </Button>
        )
      },
      cell: ({ row }) => <div >{row.getValue("datecde")}</div>,
    },
    {
      accessorKey: "datelivr",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date livr souhaitée
          </Button>
        )
      },
      cell: ({ row }) => <div >{row.getValue("datelivr")}</div>,
    },
    {
      accessorKey: "article",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Article
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-40 break-words" >{row.getValue("article")}</div>,
    },
    {
      accessorKey: "libelle",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Libellé
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-96 break-words" >{row.getValue("libelle")}</div>,
    },
    {
      accessorKey: "pa",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prix Unitaire
          </Button>
        )
      },
      cell: ({ row }) => <div >{row.getValue("pa")}</div>,
    },
    {
      accessorKey: "qtecdee",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Qte cdée
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-20 break-words" >{row.getValue("qtecdee")}</div>,
    },
    {
      accessorKey: "unite",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unité
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-20" >{row.getValue("unite")}</div>,
    },
    {
      accessorKey: "cdemin",
      header: ({ column }) => {
        return (
          <Button
          className='px-0'
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Condit.
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-20 break-words" >{row.getValue("cdemin")}</div>,
    },
    {
      accessorKey: "qterecue",
      header: ({ column }) => {
        return (
          <Button
          className='px-0'
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Qte reçue
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-20 break-words" >{row.getValue("qterecue")}</div>,
    },
    {
      accessorKey: "comment",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Commentaire
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-50 break-words" >{row.getValue("comment")}</div>,
    },
    {
      accessorKey: "serie",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Série
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-40 break-words" >{row.getValue("serie")}</div>,
    },
    {
      accessorKey: "nconfirm",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            N°confirm.
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-32 break-words" >{row.getValue("nconfirm")}</div>,
    },
    {
      accessorKey: "fournisseur",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fournisseur
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-40 break-words" >{row.getValue("fournisseur")}</div>,
    }
    ]
  };