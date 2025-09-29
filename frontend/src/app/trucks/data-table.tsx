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
import { BsFuelPump } from "react-icons/bs";
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { FaTruck,FaFilePdf,FaFileExcel, FaCheckCircle, FaWeightHanging } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";
import { exportToExcel } from "@/app/utils/exportToExcel"
import { exportToPdf } from "@/app/utils/exportToPdf"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTables<TData, TValue>({
  columns,
  data,
  
}: DataTableProps<TData, TValue>) {
    
  const [sorting, setSorting] = useState<SortingState>([])
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = useState("")
   const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
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
    <SelectTrigger className="w-24 ">
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
      <div className=" grid  grid-cols-3 gap-y-2 sm:flex  items-center  py-2">
            
  <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="ml-2">
      <BsFuelPump />

      {table.getColumn("fuelType")?.getFilterValue() as string || "Fuel"}
     
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuCheckboxItem
      checked={!table.getColumn("fuelType")?.getFilterValue()}
      onCheckedChange={() => table.getColumn("fuelType")?.setFilterValue("")}
    >
      All
    </DropdownMenuCheckboxItem>
    {Array.from(new Set(data.map((d: any) => d.fuelType))).map((fuel) => (
  <DropdownMenuCheckboxItem
    key={fuel}
    checked={table.getColumn("fuelType")?.getFilterValue() === fuel}
    onCheckedChange={() => table.getColumn("fuelType")?.setFilterValue(fuel)}
  >
    {fuel}
  </DropdownMenuCheckboxItem>
))}

  </DropdownMenuContent>
</DropdownMenu>

 
     
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="ml-2">
      <FaTruck />
   

           {table.getColumn("truckType")?.getFilterValue() as string || "Truck"}
      
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuCheckboxItem
      checked={!table.getColumn("truckType")?.getFilterValue()}
      onCheckedChange={() => table.getColumn("truckType")?.setFilterValue("")}
    >
      All
    </DropdownMenuCheckboxItem>
    {Array.from(new Set(data.map((d: any) => d.truckType))).map((trucks) => (
  <DropdownMenuCheckboxItem
    key={trucks}
    checked={table.getColumn("truckType")?.getFilterValue() === trucks}
    onCheckedChange={() => table.getColumn("truckType")?.setFilterValue(trucks)}
  >
    {trucks}
  </DropdownMenuCheckboxItem>
))}

  </DropdownMenuContent>
</DropdownMenu>


  
  

   <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="ml-2">
      <FaCheckCircle />
      <span className="">

           {table.getColumn("status")?.getFilterValue() as string || "Status"}
      </span>
   
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuCheckboxItem
      checked={!table.getColumn("status")?.getFilterValue()}
      onCheckedChange={() => table.getColumn("status")?.setFilterValue("")}
    >
      All
    </DropdownMenuCheckboxItem>
    {Array.from(new Set(data.map((d: any) => d.status))).map((status) => (
  <DropdownMenuCheckboxItem
    key={status}
    checked={table.getColumn("status")?.getFilterValue() === status}
    onCheckedChange={() => table.getColumn("status")?.setFilterValue(status)}
  >
    {status}
  </DropdownMenuCheckboxItem>
))}

  </DropdownMenuContent>
</DropdownMenu>
 
  <Input
  placeholder="Search truckNumber, city, state..."
  value={globalFilter}
  onChange={(event) => setGlobalFilter(event.target.value)}
  className="max-w-md md:ml-2 col-span-2"
/>
        

  
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" >
              <LuSettings2 /> <span className="hidden md:block">View</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent >
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
      <Button  className="bg-black hover:bg-black text-white ml-auto" ><Link href='/trucks/add/add'>Add Trucks</Link></Button>
      </div>

    <div className="overflow-hidden rounded-md border">   
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center  ">
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
                  <TableCell key={cell.id} className="text-center  ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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