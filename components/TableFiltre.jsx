"use client"

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColumnsTransport } from "@/components/ColumnsTable";
import exportDataSelected from "@/utils/exportDataSelected";
import LoaderTable from "./LoaderTable";
import { baseURL } from "@/utils/baseURL";


const TableFiltre = ({setData, data, transporters, pageName, setRowSelection, rowSelection}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [transporterUpdateList, setTransporterUpdateList] = useState([]);

  const updateTransporter = (zonelivr, numero, index) => {
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      zonelivr: zonelivr,
    };

    setData(updatedData);
    setTransporterUpdateList([...transporterUpdateList, {zonelivr, numero}]); 
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2000, // Nombre de lignes par page
  });

  const columns = getColumnsTransport(transporters, pageName, updateTransporter);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleChange = async () => {
    const colisage = await fetch(`${baseURL}/transport/setTransporters`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transporterUpdateList),
    });
  };

  return (
    <div className="w-full bg-slate-50 p-5">

      <div className="flex justify-between">
        <div className="flex items-center space-x-4 py-4">
          <Input
            placeholder="Filtrer par n° de commande..."
            value={(table.getColumn("numero")?.getFilterValue() ) ?? ""}
            onChange={(event) =>
              table.getColumn("numero")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border-sky-700"
          />
        </div>

        { pageName === 'transport' ?
          <div className="items-center flex space-x-4">
            <Button className='bg-sky-800 hover:bg-sky-900' onClick={() => handleChange()} >Valider</Button>
            <Button onClick={() => exportDataSelected({data, rowSelection})} className='bg-sky-800 hover:bg-sky-900' >Exporter</Button>
          </div>
        :
          <></>
        }
      </div>

      {typeof data === 'string' 
      ? 
      (<LoaderTable/>)
      :
      (<><div className="rounded-md border">
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
                  className={`border-slate-500 border-solid border-y-2
                ${parseInt(row.original.retard) === 1 && 'bg-red-200 hover:bg-red-200'} 
                ${pageName !== "colisage" && row.getValue('metrage') && 'bg-green-200 hover:bg-green-200'}
                ${pageName === 'colisage' && row.original.metrage && 'bg-green-200 hover:bg-green-200'}
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
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} ligne(s) séléctionnée sur {" "}
            {table.getFilteredRowModel().rows.length} ligne(s).
          </div>
      </div></>
      )
      }
    </div>
  )
}

export default TableFiltre;