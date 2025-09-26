"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Swal from 'sweetalert2'


export default function RequestDetailsPage() {
    const router =useRouter()
  const { lslug } = useParams(); // dynamic slug [lslug]

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const [Status,setStatus]=useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = process.env.NEXT_PUBLIC_URL_BASE;
    const res = await fetch(`${url}api/admin/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    setData(result.requests);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  const singleRequest = data.find((req) => req._id === lslug);
console.log(singleRequest)
  if (!singleRequest) {
    return <p className="p-6">No request found with ID: {lslug}</p>;
  }

  const handleApproved = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }

  
  try {
    const url = process.env.NEXT_PUBLIC_URL_BASE;
     
           Swal.fire({
          title: "Please wait...",
          text: "Submitting your request",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        });
    const res = await fetch(`${url}api/admin/requests/approve/${singleRequest._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const updatedRequest = await res.json();
      console.log(updatedRequest)
       
         await    Swal.fire({
            title: "Success",
            text: "Request approved successfully!",
           icon:"success",
            
          }).then(() => {
setStatus(updatedRequest.requestStatus);
router.push('/admin/loads')
          })
    
       // assuming your API returns the updated request
    
      
    } else {
      const errorData = await res.json();
      console.error("Failed to approve request:", errorData.message);

       Swal.fire({
            title: "Failed",
            text: "Failed to approve request",
           icon:"info",
            
          })
    }
  } catch (err) {
  
    Swal.fire({
            title: "Error",
            text: "Error approving request",
           icon:"error",
            
          })
  }finally{
    Swal.close()
  }
};

const handleReject = async()=>{
     const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }

  
  try {
    const url = process.env.NEXT_PUBLIC_URL_BASE;
     
           Swal.fire({
          title: "Please wait...",
          text: "Submitting your request",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        });
    const res = await fetch(`${url}api/admin/requests/reject/${singleRequest._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({reson:"reson"}),
    });

    if (res.ok) {
      const updatedRequest = await res.json();
      console.log(updatedRequest)
       
         await    Swal.fire({
            title: "Success",
            text: "Request Reject !",
           icon:"success",
            
          }).then(() => {
setStatus(updatedRequest.requestStatus);
router.push('/admin/loads')
          })
    
       // assuming your API returns the updated request
    
      
    } else {
      const errorData = await res.json();
      console.error("Failed to reject request:", errorData.message);

    await   Swal.fire({
            title: "Failed",
            text: "Failed to reject request",
           icon:"info",
            
          })
    }
  } catch (err) {
  
 await   Swal.fire({
            title: "Error",
            text: "Error approving request",
           icon:"error",
            
          })
  }finally{
    Swal.close()
  } 
}

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* ---------- Header ---------- */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/70 backdrop-blur">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/loads">Loads</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Request Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* ---------- Page Content ---------- */}
           <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
              Request Details
            </h1>

            {/* ---------- Sections ---------- */}
            <div className="grid grid-cols-1  gap-6">

              {/* Request Info */}
              <section className=" p-5 rounded-xl border   ">
                <h2 className="text-lg font-semibold mb-3">Request Info</h2>
                <p><span className="font-medium">Request ID:</span> {singleRequest._id}</p>
                <p><span className="font-medium">Status:</span> {singleRequest.requestStatus}</p>
                <p><span className="font-medium">Delivery Status:</span> {singleRequest.deliveryStatus}</p>

                <div>
                    <h2 className="text-lg font-semibold mb-3">Customer Details</h2>
                <p><span className="font-medium">Name:</span> {singleRequest.customerId?.name}</p>
                <p><span className="font-medium">Email:</span> {singleRequest.customerId?.email}</p>
                <p><span className="font-medium">Phone:</span> {singleRequest.customerId?.phone}</p>
                </div>
{singleRequest.requestStatus =="Accepted" && (
     <div>
                    <h2 className="text-lg font-semibold mb-3">Truck Owner Details</h2>
                <p><span className="font-medium">Name:</span> {singleRequest.acceptedByTruckOwnerId?.name}</p>
                <p><span className="font-medium">Email:</span> {singleRequest.acceptedByTruckOwnerId?.email}</p>
                <p><span className="font-medium">Phone:</span> {singleRequest.acceptedByTruckOwnerId?.phone}</p>
                </div>
)}
               

                <div>
                     <h2 className="text-lg font-semibold mb-3">Pickup Details</h2>
                <p><span className="font-medium">State:</span> {singleRequest.pickupState}</p>
                <p><span className="font-medium">City:</span> {singleRequest.pickupCity}</p>
                <p><span className="font-medium">Address:</span> {singleRequest.pickupAddress}</p>
                </div>

                <div>
                       <h2 className="text-lg font-semibold mb-3">Drop Details</h2>
                <p><span className="font-medium">State:</span> {singleRequest.dropState}</p>
                <p><span className="font-medium">City:</span> {singleRequest.dropCity}</p>
                <p><span className="font-medium">Address:</span> {singleRequest.dropAddress}</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-3">Load Details</h2>
                <p><span className="font-medium">Type:</span> {singleRequest.loadType}</p>
                <p><span className="font-medium">Weight:</span> {singleRequest.loadWeight} kg</p>
                </div>
{singleRequest.requestStatus =="Accepted" && (
                <div>
                     <h2 className="text-lg font-semibold mb-3">Truck Details :{singleRequest?.acceptedTruckId?.truckNumber}</h2>
                <p><span className="font-medium">Type:</span> {singleRequest?.acceptedTruckId?.truckType}</p>
                <p><span className="font-medium">capacity:</span> {singleRequest?.acceptedTruckId?.capacity} </p>

                  
                </div>
)}
                {/* Dates */}
            <div className="mt-8 border-t pt-4 text-sm text-gray-500 flex flex-col gap-1">
              <p><b>Created:</b> {new Date(singleRequest.createdAt).toLocaleString()}</p>

            </div>

            <div>
               {singleRequest.requestStatus =="Accepted" && (
                <div className="flex justify-end gap-2">
                   <Button variant='outline' onClick={handleApproved}>Approved</Button>
                                     <Button onClick={handleReject}>Rejected</Button>
                </div>
)} 
            </div>
              </section>

        

            </div>

            
          </div>
        </div>
        
      </SidebarInset>
    </SidebarProvider>
  );
}

/* ------------------ Reusable Info Card ------------------ */

