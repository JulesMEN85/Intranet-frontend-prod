'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {Form} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { baseURL } from "@/utils/baseURL";
import { useEffect, useState } from "react";
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
import { getColumnsFournisseur } from "@/components/ColumnsArticleOrderFournisseur";
import useUserStore from '@/store/userStore';

const ModalCDEFourn = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null; // Ou un message d'erreur, par exemple : <p>Pas de données disponibles</p>
  }

  const userState = useUserStore(); 
  const { userLevel, token } = useUserStore();
  
  // Utilisez un tableau vide par défaut si `data` n'est pas un tableau
  const safeData = Array.isArray(data) ? data : [];

  const articles = safeData.reduce((acc, item) => {
    acc[item.article ? item.article : item.libelle] = {
      qterecue: item.qterecue,
      numligne: item.numligne,
      pa: item.pa,
    };
    return acc;
  }, {});

  
  const qteRecueValues = safeData.reduce((acc, item) => {
    acc[item.article ? item.article : item.libelle] = item.qterecue;
    return acc;
  }, {});

  const form = useForm({
    defaultValues: {
      numcom: data[0]?.numcom || "", // Valeur par défaut si `numcom` n'est pas défini
      fourn: data[0]?.fourn || "", // Valeur par défaut si `fourn` n'est pas défini
      ...qteRecueValues,
    },
  });


  // Gestion de la soumission
  const onSubmit = async (event) => {
    try {
      const setQtee = await fetch(`${baseURL}/fournisseur/setQteeArticleRecue`, {
        method: "PUT",
        headers: {
          authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...event, articles }),
      });

      const responseQte = await setQtee.json();

      if (!responseQte.ok) {
        throw new Error("Erreur lors de l'appel API");
      }

      userState.setUser({ token: token, userLevel: parseInt(responseQte) });
      localStorage.setItem("userLevel", parseInt(responseQte));
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  const [windowHeight, setWindowHeight] = useState(window.visualViewport.height);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.visualViewport.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2000, // Nombre de lignes par page
  });

  const columns = getColumnsFournisseur(form);

  // Utilisation de `safeData` pour `useReactTable`
  const table = useReactTable({
    data: safeData,
    columns: getColumnsFournisseur(form),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });
    
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-sky-700 text-slate-50 border-sky-700" >Voir Commande</Button>
      </DialogTrigger>
      <DialogContent className={`max-w-[90%] top-0 translate-y-0 overflow-y-auto`} 
      style={{maxHeight: `${windowHeight}px`}} 
      aria-describedby={undefined}
      onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
        <DialogTitle className="text-lg flex justify-between">
          <ul className="flex flex-col">
            <li>Commande : {data[0]?.numcom || "Non disponible"}</li>
            <li>Fournisseur: {data[0]?.fournisseur || "Non disponible"}</li>
            <li>Série: {data[0]?.serie || "Non disponible"}</li>
          </ul>
          <ul className="flex flex-col">
            <li>Date Commande: {data[0]?.datecde || "Non disponible"}</li>
            <li>Date Livraison souhaitée: {data[0]?.datelivr || "Non disponible"}</li>
            <li>Commentaire: {data[0]?.comment || "Aucun"}</li>
          </ul>
        </DialogTitle>
        </DialogHeader>

        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full justify-center">

            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead className='px-1' key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className={`border-slate-500 border-solid border-y-2 hover:bg-sky-200
                        ${row.getValue('qterecue') === row.getValue('qtecdee') && 'bg-green-200 hover:bg-green-200'}
                        `}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className='px-1 text-base' key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Aucun résultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
      
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" >Valider</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="reset" variant="destructive">
              Annuler
            </Button>
          </DialogClose>
        </DialogFooter>

        </form>
      </Form>

      </DialogContent>

    </Dialog>
  )
}

export default ModalCDEFourn;