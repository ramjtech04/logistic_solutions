"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Trucks = {
  _id: string;
  truckNumber:string;
  truckType: string;
  capacity:string;
  state:string;
  city:string;
  fuelType?:string;
  status?:string;

  

 
  
}

export const columns=(refreshTable: () => void): ColumnDef<Trucks>[] => [
    {
    id: "sno", // no accessorKey needed
    header: "S.No",
    cell: ({ row }) => row.index + 1, // ✅ index + 1
    
  },
      {
    accessorKey: "truckNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        truckNumber
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "truckType",
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          truckType
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "capacity",
      header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Capacity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
 
  },
    {
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          State
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
        {
    accessorKey: "city",
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          City
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
        accessorKey: "fuelType",
         header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          fuelType
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
        accessorKey: "status",
         header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }, 
    },
  
  {
 
  id: "actions",
  cell: ({ row }) => {
    const role = localStorage.getItem("role");
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }else{
               console.log(token);
        }
 const url=process.env.NEXT_PUBLIC_URL_BASE;
        const res = await fetch(`${url}api/trucks/${row.original._id}`, {
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
       <div className="flex gap-2">
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700 ">
        <FaTrashAlt size={16} />
      </button>
      {role=='truck_owner' && (
       <Link href={`/trucks/${row.original._id}`} className="text-sky-500 hover:text-sky-700">
        <FaPen size={16} />
      </Link>
      )}
      </div>
       </>
    )
  },
}


]