"use client"
import { Button } from "@/components/ui/button"
import {
  ColumnDef,
 ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
   getSortedRowModel,
  useReactTable,
   SortingState,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { exportToExcel } from "@/app/utils/exportToExcel"
import { exportToPdf } from "@/app/utils/exportToPdf"
import { FaFileExcel } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { FaFilePdf } from "react-icons/fa";
import Link from "next/link"
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    
  const [sorting, setSorting] = useState<SortingState>([])
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
   const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const[globalFilter,setGlobalFilter]=useState("")
   const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10, // default 10 rows
});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      
    getSortedRowModel: getSortedRowModel(),
     onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
       columnFilters,
       rowSelection,
        columnVisibility,
        globalFilter,
      pagination,
    },
      onPaginationChange: setPagination,
  })

  return (
    <>
<div className="flex gap-2">



<Button
  variant="outline"
  onClick={() => {
    const rowsToExport = table.getRowModel().rows.map((row, index) => {
      const exportedRow: Record<string, any> = {};

      // Add SNO first
      exportedRow["SNO"] = index + 1;

      // Loop through all visible cells except UI-only columns
      row.getVisibleCells().forEach((cell) => {
        if (cell.column.id !== "actions"&& cell.column.id !== "sno") {
          exportedRow[cell.column.id] = cell.getValue();
        }
      });

      // Format createdAt if present
      if (exportedRow["createdAt"]) {
        exportedRow["createdAt"] = new Date(exportedRow["createdAt"]).toLocaleString();
      }

      return exportedRow;
    });

    exportToExcel(rowsToExport as any, "table-data.xlsx");
  }}
>
 <FaFileExcel /><span className="hidden sm:block">Export to</span>Excel

</Button>

<Button
  variant="outline"
  onClick={() => {
    // 1️⃣ Prepare rows to export
    const rowsToExport = table.getRowModel().rows.map((row, index) => {
      const exportedRow: Record<string, any> = {}

      // Add SNO column
      exportedRow["SNO"] = index + 1

      // Add only visible columns (skip UI-only columns)
      row.getVisibleCells().forEach((cell) => {
        if (cell.column.id !== "actions" && cell.column.id !== "sno") {
          exportedRow[cell.column.id] = cell.getValue()
        }
      })

      // Format createdAt column if present
      if (exportedRow["createdAt"]) {
        exportedRow["createdAt"] = new Date(exportedRow["createdAt"]).toLocaleString()
      }

      return exportedRow
    })

    // 2️⃣ Prepare columns for PDF
    const pdfColumns = Object.keys(rowsToExport[0] || {}).map((key) => ({
      header: key,
      key,
    }))

    // 3️⃣ Call your exportToPdf function (with Save As dialog)
    exportToPdf({
      columns: pdfColumns,
      data: rowsToExport,
      fileName: "table-data.pdf", // default filename
    })
  }}
>

  <FaFilePdf /> <span className="hidden sm:block"> Export to </span>PDF
  
</Button>
 <Select 
    value={pagination.pageSize.toString()}
    onValueChange={(value) => {
      const newSize = value === "All" ? data.length : Number(value);
      setPagination({ pageIndex: 0, pageSize: newSize });
    }}
  >
    <SelectTrigger className="w-24 ml-auto">
      <SelectValue placeholder="Select" />
    </SelectTrigger>
    <SelectContent>
        <SelectItem value="5">5</SelectItem>
      <SelectItem value="10">10</SelectItem>
      <SelectItem value="25">25</SelectItem>
      <SelectItem value="50">50</SelectItem>
      <SelectItem value="100">100</SelectItem>
      <SelectItem value="500">500</SelectItem>
      <SelectItem value="1000">1000</SelectItem>
      <SelectItem value="All">All</SelectItem>
    </SelectContent>
  </Select>
</div>


          <div className="flex items-center py-4 gap-1">
        
         <Input
         placeholder="Search"
         value={globalFilter}
         onChange={(event) => setGlobalFilter(event.target.value)}
         className="max-w-md"
       />
     

     

         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" >
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="bg-black hover:bg-black text-white ml-auto"><Link href='/Loadmanage/add-load-manage'>Add </Link></Button>
      </div>

    <div className="overflow-hidden rounded-md border hidden md:block">   
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center ">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow >
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    <div className="block md:hidden space-y-4">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            {row.getVisibleCells().map((cell) => (
              <div
                key={cell.id}
                className="flex justify-between py-1 border-b last:border-none"
              >
                {/* Fixed Header */}
                <span className="font-medium text-gray-600">
                  {cell.column.columnDef.header && typeof cell.column.columnDef.header === "string"
                    ? cell.column.columnDef.header
                    : cell.column.id}
                </span>
    
                {/* Cell Value */}
                <span className="text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-6">No results.</p>
      )}
    </div>
    
          <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
  {table.getFilteredSelectedRowModel().rows.length} of{" "}
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
       
          <Button
    variant="outline"
    size="sm"
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    Previous
  </Button>
  <Button
    variant="outline"
    size="sm"
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    Next
  </Button>
      </div>
      </>
  )
}