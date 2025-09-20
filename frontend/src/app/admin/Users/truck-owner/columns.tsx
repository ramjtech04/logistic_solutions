"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { FaTrashAlt } from "react-icons/fa";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  _id: string
  name:string
  email: string
  phone:string

  
}

export const columns=(refreshTable: () => void): ColumnDef<User>[] => [
    {
    id: "sno", // no accessorKey needed
    header: "S.No",
    cell: ({ row }) => row.index + 1, // ✅ index + 1
    
  },
      {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
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
    header: "Phone",
  },
  
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

        const res = await fetch(`http://localhost:5000/api/users/${row.original._id}`, {
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
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        <FaTrashAlt size={16} />
      </button>
    )
  },
}


]