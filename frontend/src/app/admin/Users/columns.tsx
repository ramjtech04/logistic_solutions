"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link";
import { FaEye, FaTrashAlt, FaTruck } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  _id: string
  name:string
  email: string
  phone:string
  createdAt:string
  role :string
  truckCount?:number
}

export const columns=(refreshTable: () => void): ColumnDef<User>[] => [
    {
    id: "sno", // no accessorKey needed
     header: ({ column }) => {
      return (
        <Button
         className="font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SNO
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => row.index + 1, // ✅ index + 1
    
  },
      {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
     header: ({ column }) => {
      return (
        <Button 
          className="font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phone",
     header: ({ column }) => {
      return (
        <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  }
  ,{
    accessorKey:"createdAt",
     header: ({ column }) => {
      return (
        <Button
          className="font-semibold text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  
  cell: ({ row }) => {
    const date = new Date(row.original.createdAt)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
        hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  },
  }
  ,
  
  
  {
  id: "actions",
   header: ({ column }) => {
      return (
        <Button
          className=" font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Actions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  cell: ({ row }) => {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }else{
               console.log(token);
        }

        await fetch(`http://localhost:5000/api/users/${row.original._id}`, {
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
      <div className="flex justify-center items-center  gap-4">
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        <FaTrashAlt size={16} />
      </button>
      <Link href={`/admin/Users/edit-user/Edit/${row.original._id}`} className="text-sky-500 hover:text-sky-700">
        <FaPen size={16} />
      </Link>
      <Link href={`/admin/Users/edit-user/View/${row.original._id}`} className="text-pink-500 hover:text-pink-700">
        <FaEye size={16} />
      </Link>
      
      {row.original.role ==="truck_owner" &&(
<Link  href={`/admin/Users/truck-owner/${row.original._id}`}  className="text-purple-500 hover:text-purple-700 flex items-center gap-1">
       <FaTruck size={16} />({row.original.truckCount})
      </Link>
    
      )}
       </div>
      </>
    )
  },
}


]