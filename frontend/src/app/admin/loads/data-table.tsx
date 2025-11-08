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

import { GrStatusGood } from "react-icons/gr";
import { LuSettings2 } from "react-icons/lu";
import { FaCirclePlus, FaTruck } from "react-icons/fa6"
import { request } from "http"
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
    useState<VisibilityState>({
      requestStatus:false,
      deliveryStatus:false,

    })
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
      {/* <BsFuelPump /> */}
     
        <GrStatusGood />
<span className="hidden sm:block">
      {table.getColumn("requestStatus")?.getFilterValue() as string || "Status"}
      </span>
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuCheckboxItem
      checked={!table.getColumn("requestStatus")?.getFilterValue()}
      onCheckedChange={() => table.getColumn("requestStatus")?.setFilterValue("")}
    >
      All
    </DropdownMenuCheckboxItem>
    {Array.from(new Set(data.map((d: any) => d.requestStatus))).map((requestS) => (
  <DropdownMenuCheckboxItem
    key={requestS}
    checked={table.getColumn("requestStatus")?.getFilterValue() === requestS}
    onCheckedChange={() => table.getColumn("requestStatus")?.setFilterValue(requestS)}
  >
    {requestS}
  </DropdownMenuCheckboxItem>
))}

  </DropdownMenuContent>
</DropdownMenu>

 
     
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="ml-2">
      <FaTruck />
      <span className="hidden md:block">

           {table.getColumn("deliveryStatus")?.getFilterValue() as string || "Delivery Status"}
      </span>
   
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuCheckboxItem
      checked={!table.getColumn("deliveryStatus")?.getFilterValue()}
      onCheckedChange={() => table.getColumn("deliveryStatus")?.setFilterValue("")}
    >
      All
    </DropdownMenuCheckboxItem>
    {Array.from(new Set(data.map((d: any) => d.deliveryStatus))).map((deliveryS) => (
  <DropdownMenuCheckboxItem
    key={deliveryS}
    checked={table.getColumn("deliveryStatus")?.getFilterValue() === deliveryS}
    onCheckedChange={() => table.getColumn("deliveryStatus")?.setFilterValue(deliveryS)}
  >
    {deliveryS}
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

    <div className="overflow-hidden rounded-md border hidden md:block">   
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="group hover:bg-gray-50 transition-colors cursor-pointer">
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
        <TableBody >
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
              className="group"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center ">
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
            <span className="text-gray-900 text-right">
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