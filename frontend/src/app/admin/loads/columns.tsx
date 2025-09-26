"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link";
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
    
  },{
    accessorKey:"createdAt",
     header: "DateTime",
  cell: ({ row }) => {
    const date = new Date(row.original.createdAt);
    return date.toLocaleString(); // e.g. 24/09/2025, 10:30:45 AM
  },
  },
   {
    accessorKey: "pickupCity",
     header:"pickupCity",
    
  },  {
    accessorKey: "dropCity",
     header:"dropCity",
    
  },
  
    {
    accessorKey: "loadType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          loadType
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },{
    accessorKey: "loadWeight",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          loadWeight
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  }
 ,{
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
  } , {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <Link
        href={`/admin/loads/${row.original._id}`}
        className="text-blue-600 underline"
      >
        View
      </Link>
    ),
  },


]