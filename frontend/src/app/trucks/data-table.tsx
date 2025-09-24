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
import { FaTruck } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";
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
    }
  })

  return (
    <>
          <div className="flex  items-center  py-4">
     

     <Input
  placeholder="Search truckNumber, city, state..."
  value={globalFilter}
  onChange={(event) => setGlobalFilter(event.target.value)}
  className="max-w-md"
/>
     
     
  <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="ml-2">
      <BsFuelPump />
<span className="hidden sm:block">
      {table.getColumn("fuelType")?.getFilterValue() as string || "Fuel Type"}
      </span>
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
      <span className="hidden md:block">

           {table.getColumn("truckType")?.getFilterValue() as string || "Truck Type"}
      </span>
   
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
            <Button variant="outline" className="sm:ml-auto">
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
      </div>

    <div className="overflow-hidden rounded-md border">   
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
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