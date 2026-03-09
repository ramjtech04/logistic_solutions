"use client";

import { Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";


interface ExpenseItem {
  expenseType: string;
  amount: number;
  customExpense?: string;
}

interface MaintenanceFormData {
  truck: string;
  date: string;
  expenses: ExpenseItem[];
}

interface Truck {
  _id: string;
  truckNumber: string;
}
interface BackendExpense {
  expense: string;
  amount: number;
}
const MaintenanceForm: React.FC = () => {
 
  const params = useParams();

  const mode = params?.mode as string | undefined;

  const maintenanceId = params?.id as string | undefined;
console.log(mode +" "+ maintenanceId)
  const [form, setForm] = useState<MaintenanceFormData>({
    truck: "",
    date: "",
    expenses: [
      {
        expenseType: "",
        amount: 0,
        customExpense: "",
      },
    ],
  });

  const [trucks, setTrucks] = useState<Truck[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const url = process.env.NEXT_PUBLIC_URL_BASE;

  const expenseOptions = [
    "Oil Change",
    "Tyre Repair",
    "Brake Repair",
    "Fuel",
    "Engine Service",
    "Other",
  ];

  /* ---------------- FETCH TRUCKS ---------------- */

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const res = await fetch(`${url}api/trucks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          setTrucks(data.data);
   
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrucks();
  }, [token, url]);

  /* ---------------- FETCH MAINTENANCE (EDIT MODE) ---------------- */

  useEffect(() => {
    if (!maintenanceId) return;

    const fetchMaintenance = async () => {
      try {
        const res = await fetch(`${url}api/maintenance/${maintenanceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          const maintenance = data.data;

          setForm({
               truck: maintenance.vehicle._id || maintenance.vehicle,
            date: maintenance.date.split("T")[0],
            expenses: maintenance.expenses.map((exp: BackendExpense) => ({
              expenseType: expenseOptions.includes(exp.expense)
                ? exp.expense
                : "Other",
              amount: exp.amount,
              customExpense: expenseOptions.includes(exp.expense)
                ? ""
                : exp.expense,
            })),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMaintenance();
  }, [maintenanceId, token, url]);

  /* ---------------- FORM INPUT CHANGE ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- EXPENSE CHANGE ---------------- */

  const handleExpenseChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...form.expenses];

    updated[index] = {
      ...updated[index],
      [field]: field === "amount" ? Number(value) : value,
    };

    setForm({
      ...form,
      expenses: updated,
    });
  };

  /* ---------------- ADD EXPENSE ---------------- */

  const addExpense = () => {
    setForm({
      ...form,
      expenses: [
        ...form.expenses,
        {
          expenseType: "",
          amount: 0,
          customExpense: "",
        },
      ],
    });
  };

  /* ---------------- REMOVE EXPENSE ---------------- */

  const removeExpense = (index: number) => {
    const updated = form.expenses.filter((_, i) => i !== index);

    setForm({
      ...form,
      expenses: updated,
    });
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedExpenses = form.expenses.map((exp) => ({
      expense:
        exp.expenseType === "Other" ? exp.customExpense : exp.expenseType,
      amount: exp.amount,
    }));

    try {
      const res = await fetch(
        maintenanceId
          ? `${url}api/maintenance/${maintenanceId}`
          : `${url}api/maintenance`,
        {
          method: maintenanceId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vehicle: form.truck,
            date: form.date,
            expenses: formattedExpenses,
          }),
        }
      );

      const data = await res.json();
console.log(data)
      if (data.success) {
        toast.success(
          maintenanceId
            ? "Maintenance Updated Successfully"
            : "Maintenance Added Successfully",
          { position: "top-center" }
        );
 setForm({
    truck: "",
    date: "",
    expenses: [
      {
        expenseType: "",
        amount: 0,
        customExpense: "",
      },
    ],
  });

        // router.push("/admin/maintenance");
      } else {
        toast.error("Operation Failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error", { position: "top-center" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        {maintenanceId ? "Edit Maintenance" : "Add Maintenance"}
      </h2>

      {/* Truck */}
      <select
        name="truck"
        value={form.truck}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      >
        <option value="">Select Truck</option>

        {trucks.map((truck) => (
          <option key={truck._id} value={truck._id}>
            {truck.truckNumber}
          </option>
        ))}
      </select>

      {/* Date */}

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      {/* Expenses */}

      <div className="space-y-3">
        {form.expenses.map((expense, index) => (
          <div key={index} className="flex gap-2 items-center">

            {/* Expense Type */}

            <select
              value={expense.expenseType}
              onChange={(e) =>
                handleExpenseChange(index, "expenseType", e.target.value)
              }
              className="border rounded-lg p-2 w-1/2"
              required
            >
              <option value="">Select Expense</option>

              {expenseOptions.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>

            {/* Custom Expense */}

            {expense.expenseType === "Other" && (
              <input
                type="text"
                placeholder="Custom Expense"
                value={expense.customExpense}
                onChange={(e) =>
                  handleExpenseChange(
                    index,
                    "customExpense",
                    e.target.value
                  )
                }
                className="border rounded-lg p-2 w-1/2"
                required
              />
            )}

            {/* Amount */}

            <input
              type="number"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) =>
                handleExpenseChange(index, "amount", e.target.value)
              }
              className="border rounded-lg p-2 w-32"
              required
            />

            {/* Remove */}

            {form.expenses.length > 1 && (
              <button
                type="button"
                onClick={() => removeExpense(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                <Trash />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Expense */}

      <button
        type="button"
        onClick={addExpense}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Expense
      </button>

      {/* Submit */}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg"
      >
        {maintenanceId ? "Update Maintenance" : "Save Maintenance"}
      </button>
    </form>
  );
};

export default MaintenanceForm;