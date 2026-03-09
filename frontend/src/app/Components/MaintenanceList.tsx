"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowLeft, ArrowRight, Edit, EllipsisVertical, History, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

interface Expense {
  expense: string;
  amount: number;
}

interface Maintenance {
  _id: string;
  vehicle?: { _id:string,truckNumber: string };
  date: string;
  rawDate?: string;
  expenses?: Expense[];
}

interface MaintenanceAPI {
  _id: string;
  vehicle?: { _id:string,truckNumber: string };
  date: string;
  expenses?: Expense[];
}

interface Truck {
  _id: string;
  truckNumber: string;
}

const MaintenanceList = () => {
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
const router =useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const url = process.env.NEXT_PUBLIC_URL_BASE;

  // Fetch trucks
  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const res = await fetch(`${url}api/trucks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setTrucks(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token && url) fetchTrucks();
  }, [token, url]);

  // Fetch maintenance
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await fetch(`${url}api/maintenance`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
console.log(data)
        if (data.success) {
          const formatted = data.data.map((item: MaintenanceAPI) => ({
            _id: item._id,
            vehicle: item.vehicle || "Unknown Truck",
            date: new Date(item.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            rawDate: item.date.split("T")[0],
            expenses: item.expenses || [],
          }));

          setMaintenanceList(formatted);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (token && url) fetchMaintenance();
  }, [token, url]);

  // Delete maintenance
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${url}api/maintenance/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = maintenanceList.filter((item) => item._id !== id);
      setMaintenanceList(updated);

      const newTotalPages = Math.ceil(updated.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter
  const filteredMaintenance = maintenanceList.filter((item) => {
    return (
      (!selectedTruck || item.vehicle?.truckNumber === selectedTruck) &&
      (!selectedDate || item.rawDate === selectedDate)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredMaintenance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = filteredMaintenance.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white  rounded-xl min-h-screen">
      {/* Filters */}
      
      
      <div className="grid grid-cols-2 gap-4 my-4">
        <Combobox
          items={trucks}
          value={selectedTruck}
          onValueChange={(truckNumber) => {
            setSelectedTruck(truckNumber || "");
            setCurrentPage(1);
          }}
          itemToStringValue={(truck) => truck}
        >
          <ComboboxInput placeholder="Search Truck Number..." />

          <ComboboxContent>
            <ComboboxEmpty>No trucks found.</ComboboxEmpty>

            <ComboboxItem value="">All trucks</ComboboxItem>

            <ComboboxList>
              {(truck) => (
                <ComboboxItem key={truck._id} value={truck.truckNumber}>
                  {truck.truckNumber}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg p-2"
        />
      </div>
<div className="flex items-center justify-between">
   <h1 className="my-2 font-bold">
        Total Records : {filteredMaintenance.length}
      </h1>
  <Link href={'/maintenance/add'} className="bg-black text-white px-2 py-2  my-2 rounded  ">add</Link>
</div>
     

      {/* Maintenance Records */}

      <div className="space-y-3">
        {currentItems.length === 0 && (
          <p className="text-gray-500 text-sm">No maintenance found</p>
        )}

        {currentItems.map((item) => {
          const total = item.expenses?.reduce(
            (sum, exp) => sum + exp.amount,
            0
          );

          return (
            <div
              key={item._id}
              className="border p-4 rounded-lg flex justify-between"
            >
         
              <div>
                <p className="text-gray-800 text-sm">
 
  <span className="font-bold">{item.vehicle?.truckNumber}</span>
</p>
               

                <p className="text-sm text-gray-500">{item.date}</p>

                <div className="text-sm text-gray-600 mt-1">
                  {item.expenses?.slice(0,5).map((exp, i) => (
                    <p key={i}>
                      {exp.expense} • ₹{exp.amount}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold text-indigo-600">₹{total}</p>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <EllipsisVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                    <DropdownMenuItem onClick={()=>{router.push(`/maintenance/view/${item._id}`)}}> <History/> View </DropdownMenuItem>
                     <DropdownMenuItem onClick={()=>{router.push(`/maintenance/edit/${item._id}`)}}> <Edit/> Edit </DropdownMenuItem>  
                   
                    </DropdownMenuGroup> 
                    <DropdownMenuSeparator /> 
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(item._id)}
                      >
                        <TrashIcon /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            size="icon"
          >
            <ArrowLeft />
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "secondary" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="ghost"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            size="icon"
          >
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;