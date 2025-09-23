import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import {FormControl, FormField, FormItem} from "@/components/ui/form";

export const getColumnsFournisseur = (form) => {
  return [
    {
      accessorKey: "numcom",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
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
          <></>
        )
      },
      cell: ({ row }) =><></>,
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
      cell: ({ row }) => <FormField
            control={form.control}
            name={row.getValue("article") ? row.getValue("article") : row.getValue("libelle")}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id={row.getValue("article") ? row.getValue("article") : row.getValue("libelle")}
                    className='bg-sky-50 max-w-20'
                    {...field}
                  />
                </FormControl> 
              </FormItem>
            )}/>
            ,
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
    }
    ]
  };