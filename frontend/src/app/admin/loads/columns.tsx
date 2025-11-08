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
 customerId?:{
    name:string
    email:string
    phone:string
 }
 assignedTruckId?: {
    truckNumber: string
  } | null
  acceptedTruckId?:{
    truckNumber: string
  }|null
}

export const columns=(refreshTable: () => void): ColumnDef<Loads>[] => [
    {
    id: "sno", // no accessorKey needed
    header: "S.No",
    cell: ({ row }) => row.index + 1, // ✅ index + 1
    
  },
{
  accessorKey: "createdAt",
  header: "Date and time",
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
},
  
 {
  id: "Pickup Details",
  header: "Pickup Details",
  accessorFn: (row) => `${row.pickupAddress}${row.pickupCity}${row.pickupState}`,  
  cell: ({ row }) => (
  <>
   
       {row.original.pickupAddress} <br/>
      {row.original.pickupCity}, {row.original.pickupState}
  
   
   </>
  ),
  enableGlobalFilter: true,   // ✅ searchable
},
  {
  id: "Drop Details",
  header: "Drop Details",
  accessorFn: (row) => `${row.dropAddress}${row.dropCity}${row.dropState}`,  
  cell: ({ row }) => (
  <>
   
       {row.original.dropAddress} <br/>
      {row.original.dropCity}, {row.original.dropState}
  
   
   </>
  ),
  enableGlobalFilter: true,   // ✅ searchable
},
  {
  id: "Customer Details",
  header: "Customer Details",
  accessorFn: (row) => `${row.customerId?.name}${row.customerId?.email}${row.customerId?.phone}`,  
  cell: ({ row }) => (
  <>
   
       {row.original.customerId?.name} <br/>
      ({row.original.customerId?.email}, {row.original.customerId?.phone})
  
   
   </>
  ),
  enableGlobalFilter: true,   // ✅ searchable
},
    {
  id: "loadInfo",
  header: "Load Info",
  accessorFn: (row) => `${row.loadType}${row.loadWeight}`,  // ✅ merge values
  cell: ({ row }) => (
    <span>
      {row.original.loadType} ({row.original.loadWeight})
    </span>
  ),
  enableGlobalFilter: true,   // ✅ searchable
},
{
  id: "truckNumber",
  header: "Truck Number",
  accessorFn: (row) => 
    row.assignedTruckId?.truckNumber ??
    row.acceptedTruckId?.truckNumber ??
    "Not Assigned",
  cell: ({ row }) => (
    <span className="font-medium">
      {row.original.assignedTruckId?.truckNumber ||
       row.original.acceptedTruckId?.truckNumber ||
       "Not Assigned"}
    </span>
  ),
  enableGlobalFilter: true,
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
    }
  } ,{
    accessorKey: "requestStatus",
      enableHiding: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          requeststatus
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
    
  } ,
  {
  id: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const date = new Date(row.original.createdAt);
    const formatted = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
      
      <div className="flex  gap-3  items-center ">
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        <FaTrashAlt size={16} />
      </button>
      <Link
        href={`/admin/loads/${row.original._id}`}
        className="text-pink-600 hover:text-eye-800 underline"
      >
      <FaFileInvoice />
      </Link>
   </div>

      </>
    )
  },
},{
    id: "Update Status",
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
    
     cell: ({ row }) => {

  
const handleStatusUpdate = async (requestId: string, newStatus: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const url = process.env.NEXT_PUBLIC_URL_BASE;

    const res = await fetch(`${url}api/delivery/updatestatus/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }), // ✅ match backend enum
    });

    const result = await res.json();
    if (res.ok) {
      console.log("Status updated:", result);
      refreshTable(); // refresh table after update
    } else {
      console.error("Error updating status:", result.message || result);
      alert("Failed to update status");
    }
  } catch (err) {
    console.error("Request failed:", err);
    alert("Something went wrong");
  }
};

      return(
        <>

{ (row.original.requestStatus == "Pending") && (
  <Link    href={`/admin/loads/${row.original._id}`}
    className="bg-yellow-500 text-white px-2 py-1 rounded" 
    
  >
  AssignTruck
  </Link>
)}  
{ (row.original.requestStatus == "Accepted") && (
  <Link    href={`/admin/loads/${row.original._id}`}
    className="bg-sky-500 text-white px-2 py-1 rounded" 
    
  >
  SHow Details
  </Link>
)}    

  {(row.original.requestStatus === "Cancelled") && (
  <Button
    className="bg-red-500 text-white px-2 py-1 rounded" disabled={true}
    
  >
   Cancelled
  </Button>
)}
 
{row.original.deliveryStatus === "NotStarted" && row.original.requestStatus === "Approved" && (
  <Button
    className="bg-green-800 text-white px-2 py-1 rounded"
    onClick={() => handleStatusUpdate(row.original._id, "InTransit")}
  >
    NotStarted
  </Button>
)}
{row.original.deliveryStatus === "InTransit" && row.original.requestStatus === "Approved" &&  (
  <Button
    className="bg-blue-800 text-white px-2 py-1 rounded"
    onClick={() => handleStatusUpdate(row.original._id, "Delivered")}
  >
    InTransit
  </Button>
)}


{row.original.deliveryStatus === "Delivered" &&  row.original.requestStatus === "Approved" && (
  <Button
    className="bg-green-800 text-white px-2 py-0.5 rounded"
    disabled={true}
  >
    Delivered
  </Button>
)}
        </>
      )
     }
    },
  


]