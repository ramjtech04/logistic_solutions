"use client"

import Navbar from "@/app/Components/Navbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  name: string;
  email: string;
}
export enum DeliveryStatus {
  NotStarted = "NotStarted",
  InTransit = "InTransit",
  Delivered = "Delivered",
  Failed = "Failed",
}
interface Truck {
  _id: string;
  truckNumber: string;
  truckType?: string;
}

interface Delivery {
  _id: string;
  pickupState: string;
  pickupCity: string;
  pickupAddress: string;
  dropState: string;
  dropCity: string;
  dropAddress: string;
  loadType: string;
  loadWeight: number;
  deliveryStatus: DeliveryStatus; // NotStarted | InProcess | Transmit | Completed
  requestStatus: string; // Accepted | Approved | Transmit
  assignedTruckId?: Truck | null;
  customerId: Customer;
  createdAt: string;
  
}

const AssignTruck = () => {
  const [data, setData] = useState<Delivery[]>([]);
  const [filter, setFilter] = useState<string>(""); // Accepted, Approved, Transmit, Completed

  const url = process.env.NEXT_PUBLIC_URL_BASE;

  // Fetch deliveries for logged-in truck owner
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${url}api/delivery/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      console.log(result)
      setData(result.deliveries || []);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (requestId: string, newStatus: DeliveryStatus) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${url}api/delivery/updatestatus/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }), // pass backend enum
    });

    const result = await res.json();
    console.log(result);

    if (res.ok) {
      setData((prev) =>
        prev.map((d) =>
          d._id === requestId ? { ...d, deliveryStatus: newStatus } : d
        )
      );
    } else {
      console.error("Failed to update status:", result.message);
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

  // Filter deliveries based on selected filter button
 const filteredData = filter
  ? data.filter((d) => {
      if (filter === "Accepted") return d.requestStatus === "Accepted";
      if (filter === "Approved") 
        return d.requestStatus === "Approved" && d.deliveryStatus === DeliveryStatus.NotStarted;
      if (filter === "Transmit") return d.deliveryStatus === DeliveryStatus.InTransit;
      if (filter === "Delivered") return d.deliveryStatus === DeliveryStatus.Delivered;
      return true;
    })
  : data;


  return (
    <>
      <Navbar />

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
         <Button className="bg-black hover:bg-black text-white" onClick={() => setFilter("")}>
          All
        </Button>
        <Button className="bg-black hover:bg-black text-white" onClick={() => setFilter("Accepted")}>
          Accepted
        </Button>
        <Button className="bg-black hover:bg-black text-white" onClick={() => setFilter("Approved")}>
          Approved
        </Button>
        <Button className="bg-black hover:bg-black text-white" onClick={() => setFilter("Transmit")}>
          Transmit
        </Button>
        <Button className="bg-black hover:bg-black text-white" onClick={() => setFilter("Delivered")}>
          Delivered
        </Button>
       
      </div>

      {/* Deliveries */}
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">{filter}</h1>

        {filteredData.length === 0 ? (
          <p className="text-gray-600">No  {filter}  Result.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredData.map((delivery) => {
              // Enable buttons according to workflow
const canStart =
  delivery.deliveryStatus === DeliveryStatus.NotStarted &&
  delivery.requestStatus === "Approved";

const canTransmit =
  delivery.deliveryStatus === DeliveryStatus.InTransit 
 

const canComplete =
  delivery.deliveryStatus === DeliveryStatus.Delivered 
  


              return (
                <div key={delivery._id} className="border rounded-2xl shadow-md p-4 bg-white hover:shadow-lg transition flex flex-col justify-between">
                  <div>
                    {/* Customer Info */}
                    <div className="mb-2">
                      <h2 className="font-semibold text-base md:text-lg">{delivery.customerId?.name}</h2>
                      <p className="text-sm text-gray-500 break-words">{delivery.customerId?.email}</p>
                    </div>

                    {/* Pickup & Drop */}
                    <div className="mb-3">
                      <p className="text-sm">
                        <span className="font-medium">Pickup:</span> {delivery.pickupCity}, {delivery.pickupState}
                      </p>
                      <p className="text-xs text-gray-500 break-words">{delivery.pickupAddress}</p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Drop:</span> {delivery.dropCity}, {delivery.dropState}
                      </p>
                      <p className="text-xs text-gray-500 break-words">{delivery.dropAddress}</p>
                    </div>

                    {/* Load Info */}
                    <div className="mb-3">
                      <p className="text-sm">
                        <span className="font-medium">Load:</span> {delivery.loadType} ({delivery.loadWeight} ton)
                      </p>
                    </div>

                    {/* Assigned Truck */}
                    <div className="mb-3">
                      <p className="text-sm">
                        <span className="font-medium">Assigned Truck:</span> {delivery.assignedTruckId?.truckNumber || "Not Assigned"}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        DeliveryStatus.NotStarted === "NotStarted"
                          ? "bg-yellow-100 text-yellow-700"
                          : DeliveryStatus.InTransit == "InTransit"
                          ? "bg-blue-100 text-blue-700"
                          : DeliveryStatus.Delivered === "Delivered"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {delivery.deliveryStatus}
                      </span>
                      <span className="text-xs text-gray-500">{delivery.requestStatus}</span>
                    </div>

                    <p className="text-xs text-gray-400">Created: {new Date(delivery.createdAt).toLocaleString()}</p>
                  </div>

                  {/* Workflow Buttons */}
          
          <div className="mt-4 flex flex-col gap-2">
  <div className="mt-4 flex flex-col gap-2">
  {canStart && (
    <Button
      className="bg-blue-800 hover:bg-blue-700 text-white"
      onClick={() => handleUpdateStatus(delivery._id, DeliveryStatus.InTransit)}
    >
      Start Delivery
    </Button>
  )}

  {canTransmit && (
    <Button
      className="bg-purple-600 hover:bg-purple-700 text-white"
      onClick={() => handleUpdateStatus(delivery._id, DeliveryStatus.Delivered)}
    >
      Transmit
    </Button>
  )}

  {canComplete && (
    <Button
      className="bg-green-600 hover:bg-green-700 text-white"
      disabled
    >
      Delivered
    </Button>
  )}
</div>

</div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AssignTruck;
