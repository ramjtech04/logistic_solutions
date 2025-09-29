"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link";
import {  FaTrashAlt } from "react-icons/fa";

import { FaFileInvoice } from "react-icons/fa";

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
  } ,
  {
  id: "actions",
  cell: ({ row }) => {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }else{
               console.log(token);
        }
         const url=process.env.NEXT_PUBLIC_URL_BASE;

   
        const res = await fetch( `${url}api/admin/requests/delete/${row.original._id}`, {
          method: "DElETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
     
      alert("Deleted successfully!")
      refreshTable()
      // optional: refresh table or remove row from state
    }

    return (
      <>
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        <FaTrashAlt size={16} />
      </button>
      <Link
        href={`/admin/loads/${row.original._id}`}
        className="text-pink-600 hover:text-eye-800 underline"
      >
      <FaFileInvoice />
      </Link>
      </>
    )
  },
}



]