import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export const getColumnsTransport = (transporters, pageName, updateTransporter) => {
  if (pageName === 'transport'){
    return [
    {
      accessorKey: "dlivraison",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Delai
          </Button>
        )
      },
      cell: ({ row }) => <div >{row.getValue("dlivraison")}</div>,
    },
    {
      accessorKey: "numero",
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
      cell: ({ row }) => <div className="text-center" >
          <a className="underline text-sky-700"
          target="_blank"
          href={`file://192.168.10.2/Grp-Lallemant/Lallemant/Fabrication/Confirmation/cde-${row.getValue("numero")}.pdf`}>
            {row.getValue("numero")}
          </a>
        </div>,
    },
    {
      accessorKey: "reference",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Reference
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-52 break-words" >{row.getValue("reference")}</div>,
    },
    {
      accessorKey: "client",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Client
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-28" >{row.getValue("client")}</div>,
    },
    {
      accessorKey: "rue",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Adresse
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-60 leading-6" >{row.getValue("rue")}</div>,
    },
    {
      accessorKey: "codePostal",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CP
          </Button>
        )
      },
      cell: ({ row }) => <div >{row.getValue("codePostal")}</div>,
    },
    {
      accessorKey: "ville",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ville
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-28" >{row.getValue("ville")}</div>,
    },
    {
      accessorKey: "totht",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Montant HT
          </Button>
        )
      },
      cell: ({ row }) => <div >{row.getValue("totht")}</div>,
    },
    {
      accessorKey: "Serie",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Serie
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-40" >{row.getValue("Serie")}</div>,
    },
    {
      accessorKey: "metrage",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Metrage
          </Button>
        )
      },
      cell: ({ row }) => <div className="w-32" >{row.getValue("metrage")}</div>,
    },
    {
      accessorKey: "adresse",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Note Atl
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-40" >{row.getValue("adresse")}</div>,
    },
    {
      accessorKey: "notes",
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
      cell: ({ row }) => <div className="max-w-96 break-words leading-6" >{row.getValue("notes")}</div>,
    },
    {
      accessorKey: "zonelivr",
      header: ({column}) => {
        return (
          <Button 
            variant="ghost"
            className='px-0' 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Transporteur
          </Button>
        )
      },
      cell: ({cell, row}) =>   {
      return (
      <Select defaultValue={cell.getValue("zonelivr")} onValueChange={(zonelivr) => updateTransporter(zonelivr, row.getValue("numero"), row.index)} >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Aucun" />
        </SelectTrigger>
        <SelectContent>
          {transporters.map((item) => <SelectItem key={item.code} value={item.code} >{item.code}</SelectItem> )}
        </SelectContent>
      </Select>)},
    },
    {
      id: "select",
      header: () => {
        return (
          <div className='px-0'>Selection</div>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="w-20 flex justify-center">
            <Checkbox
              className='block bg-white'
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
      )},
      enableSorting: false,
      enableHiding: false,
    },
    ]
  } else if (pageName === 'historique'){
    return [
      {
        accessorKey: "dlivraison",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Delai
            </Button>
          )
        },
        cell: ({ row }) => <div >{row.getValue("dlivraison")}</div>,
      },
      {
        accessorKey: "numero",
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
        cell: ({ row }) => <div className="text-center" >
            <a className="underline text-sky-700"
          target="_blank"
          href={`file://192.168.10.2/Grp-Lallemant/Lallemant/Fabrication/Confirmation/cde-${row.getValue("numero")}.pdf`}>
            {row.getValue("numero")}
          </a>
          </div>,
      },
      {
        accessorKey: "reference",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Reference
            </Button>
          )
        },
        cell: ({ row }) => <div className="max-w-40" >{row.getValue("reference")}</div>,
      },
      {
        accessorKey: "client",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Client
            </Button>
          )
        },
        cell: ({ row }) => <div className="max-w-28" >{row.getValue("client")}</div>,
      },
      {
        accessorKey: "rue",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Adresse
            </Button>
          )
        },
        cell: ({ row }) => <div className="max-w-60 leading-6" >{row.getValue("rue")}</div>,
      },
      {
        accessorKey: "codePostal",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              CP
            </Button>
          )
        },
        cell: ({ row }) => <div >{row.getValue("codePostal")}</div>,
      },
      {
        accessorKey: "ville",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Ville
            </Button>
          )
        },
        cell: ({ row }) => <div className="max-w-28" >{row.getValue("ville")}</div>,
      },
      {
        accessorKey: "Serie",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Serie
            </Button>
          )
        },
        cell: ({ row }) => <div className="max-w-40" >{row.getValue("Serie")}</div>,
      },
      {
        accessorKey: "metrage",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Metrage
            </Button>
          )
        },
        cell: ({ row }) => <div className="w-32" >{row.getValue("metrage")}</div>,
      },
      {
        accessorKey: "adresse",
        header: ({ column }) => {
          return (
            <Button
              className='px-0'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Note Atl
            </Button>
          )
        },
        cell: ({ row }) => <div className="max-w-40" >{row.getValue("adresse")}</div>,
      },
      {
        accessorKey: "notes",
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
        cell: ({ row }) => <div className="max-w-96 leading-6" >{row.getValue("notes")}</div>,
      }
      ]
  } else if (pageName === 'colisage'){
    return [
    {
      accessorKey: "numero",
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
      cell: ({ row }) => <div className="text-center max-w-28" >
        <a className="underline text-sky-700"
          target="_blank"
          href={`file://192.168.10.2/Grp-Lallemant/Lallemant/Fabrication/Confirmation/cde-${row.getValue("numero")}.pdf`}>
            {row.getValue("numero")}
        </a>
      </div>
    },
    {
      accessorKey: "client",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Client
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-52" >{row.getValue("client")}</div>,
    },
    {
      accessorKey: "reference",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Reference
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-52 max-lg:max-w-36 break-words" >{row.getValue("reference")}</div>,
    },
    {
      accessorKey: "dlivraison",
      header: ({ column }) => {
        return (
          <Button
          className='px-0'
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Delai
          </Button>
        )
      },
      cell: ({ row }) => <div >{row.getValue("dlivraison")}</div>,
    },
    {
      accessorKey: "etat",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Etat
          </Button>
        )
      },
      cell: ({ row }) => <div className="max-w-40" >{row.getValue("etat")}</div>,
    },
    {
      accessorKey: "Serie",
      header: ({ column }) => {
        return (
          <Button
            className='px-0'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Serie
          </Button>
        )
      },
      cell: ({ row }) => <div className="min-w-40 max-lg:min-w-8 max-lg:max-w-28 break-words" >{row.getValue("Serie")}</div>,
    },
    {
      accessorKey: "Editer",
      header: () => {
        return (
          <div className='px-0'>
            Editer
          </div>
        )
      },
      cell: ({ row }) => <ModalColisage data={row.original} />,
    }
    ]
  }
  };