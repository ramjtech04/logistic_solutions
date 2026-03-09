"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface Expense {
  expense: string;
  amount: number;
}

interface Maintenance {
  _id: string;
  date: string;
  expenses: Expense[];
  vehicle?:{_id:string,truckNumber:string}
}

export default function MaintenanceView() {
  const params = useParams();
  const maintenanceId = params.id as string;

  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const url = process.env.NEXT_PUBLIC_URL_BASE;

  // Fetch maintenance
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        console.log(maintenanceId)
        const res = await fetch(`${url}api/maintenance/${maintenanceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
console.log(data)
        if (data.success) {
          setMaintenance(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (maintenanceId) fetchMaintenance();
  }, [maintenanceId, token, url]);

  // Delete maintenance
  const handleDelete = async () => {
    try {
      await fetch(`${url}api/maintenance/${maintenanceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMaintenance(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
  
         <>

    <div className="p-6">
  <div className="bg-white p-6 rounded-xl shadow-sm">

    <h1 className="text-2xl font-bold mb-6">
      Maintenance Details
    </h1>

    {!maintenance ? (
      <p className="text-gray-500 text-center py-10">
        No maintenance found
      </p>
    ) : (
      <div className="space-y-6">

        {/* Truck Info */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-500">Truck Number</p>
          <p className="text-lg font-semibold text-indigo-600">
            {maintenance.vehicle?.truckNumber || "Not available"}
          </p>
        </div>

        {/* Maintenance Date */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Maintenance Date</p>
          <p className="font-medium">
            {new Date(maintenance.date).toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* Expense List */}
        <div>
          <h2 className="font-semibold mb-3">Expenses</h2>

          <div className="border rounded-lg divide-y">

            {maintenance.expenses.map((exp, i) => (
              <div
                key={i}
                className="flex justify-between p-3 text-sm"
              >
                <p>{exp.expense}</p>
                <p className="font-medium">₹{exp.amount}</p>
              </div>
            ))}

          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border rounded-lg p-4 bg-indigo-50">
          <p className="font-semibold">Total Expense</p>

          <p className="text-xl font-bold text-indigo-600">
            ₹
            {maintenance.expenses.reduce(
              (sum, exp) => sum + exp.amount,
              0
            )}
          </p>
        </div>

        {/* Delete Button */}
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <TrashIcon className="size-4 mr-2" />
            Delete 
          </Button>
        </div>

      </div>
    )}
  </div>
</div>
    </>
  );
}