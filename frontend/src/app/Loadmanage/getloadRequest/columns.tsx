"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { FaTrashAlt } from "react-icons/fa";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Loads = {
  _id: string
  pickupState:string
  pickupCity: string
  pickupAddress:string
  dropAddress:string
  dropCity:string
  dropState:string
 loadType:string
 loadWeight:string
 requestStatus:string
 deliveryStatus:string
 createdAt:string
  
}

export const columns=(refreshTable: () => void): ColumnDef<Loads>[] => [
    {
    id: "sno", // no accessorKey needed
    header: "S.No",
    cell: ({ row }) => row.index + 1, // ✅ index + 1
    
  },
    {
    id: "PickupDetails",
    header: "Pickup Details",
    cell: ({ row }) => {
      const { pickupAddress, pickupCity, pickupState } = row.original;
      return `${pickupAddress}, ${pickupCity}, ${pickupState}`;
    },
    filterFn: "includesString", // enable per-column filter
  },
  {
    id: "DropDetails",
    header: "Drop Details",
    cell: ({ row }) => {
      const { dropAddress, dropCity, dropState } = row.original;
      return `${dropAddress}, ${dropCity}, ${dropState}`;
    },
    filterFn: "includesString", // enable per-column filter
  },
   {
  id: "loadInfo",
  header: "Load Info",
  accessorFn: (row) => `${row.loadType} (${row.loadWeight})`,  // ✅ merge values
  cell: ({ row }) => (
    <span>
      {row.original.loadType} ({row.original.loadWeight})
    </span>
  ),
  enableGlobalFilter: true,   // ✅ searchable
},
  {
    accessorKey: "requestStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          requestStatus
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  } ,{
    accessorKey: "deliveryStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          deliveryStatus
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },{
    accessorKey:"createdAt",
     header: "Created At",
  cell: ({ row }) => {
    const date = new Date(row.original.createdAt);
    return date.toLocaleString(); // e.g. 24/09/2025, 10:30:45 AM
  },
  }


]