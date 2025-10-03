"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function RequestDetailsPage() {
    const router =useRouter()
  const { lslug } = useParams(); // dynamic slug [lslug]

  const [data, setData] = useState<any[]>([]);
    const [truckOwners, setTruckOwners] = useState<any[]>([]);
    const [selectedTruckOwner, setSelectedTruckOwner] = useState<string>("");
  const [loading, setLoading] = useState(true);
const [Status,setStatus]=useState("");
const [trucks, setTrucks] = useState<any[]>([]);
const [selectedTruck, setSelectedTruck] = useState<string>("");
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = process.env.NEXT_PUBLIC_URL_BASE;
    const res = await fetch(`${url}api/admin/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    console.log("data is"+ result);
    setData(result.requests);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  const singleRequest = data.find((req) => req._id === lslug);

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
router.push('/admin/loads/loadrequest/approved')
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

router.push('/admin/loads/loadrequest/cancelled')
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
   const fetchTruckOwnerData = async () => {
          const token = localStorage.getItem("token");
          if (!token) return;
      const url=process.env.NEXT_PUBLIC_URL_BASE;
      
          const res = await fetch(`${url}api/users/truck-owners`, {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          const result = await res.json();
          console.log("dropdown")
          console.log(result)
          setTruckOwners(result.data??"")
          // setData(result.data??"");
        };
const fetchTrucksByOwner = async (ownerId: string) => {
 
  // Perform your logic here, e.g., API call
  try{
    if (!ownerId) return;
         const token = localStorage.getItem("token");
       console.log("token "+token)
        if (!token) return;
    const url=process.env.NEXT_PUBLIC_URL_BASE;
    
        const res = await fetch(`${url}api/trucks/owner/${ownerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const result = await res.json();
        console.log(result);
     console.log(result)
         const availableTrucks = (result.data || []).filter(
      (truck: any) => truck.status?.toLowerCase() === "available"
    );

    setTrucks(availableTrucks);
        //  setTrucks(result.data || []);
    // setSelectedRequestId(id);
   
    // setShowTruckModal(true);  
      }catch(err){
console.log(err)
      }
};


const handleSubmitAssign = async()=>{
   const token = localStorage.getItem("token");
  if(selectedTruckOwner==""){

  Swal.fire({  text: "select Truck Owner", })
return
}
if(selectedTruck==""){

  Swal.fire({  text: "select Truck", })
return
}
if(lslug==""){

  Swal.fire({  text: "select request", })
return
}

    if (!token) return;
const url=process.env.NEXT_PUBLIC_URL_BASE;
Swal.fire({
  title: "Please wait...",
  allowOutsideClick: false,
  didOpen: () => {
    Swal.showLoading();
  },
});
try{
    const res = await fetch(`${url}api/admin/requests/manual-assign`, 
     {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
             "Authorization":   `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({requestId:lslug,truckId:selectedTruck,truckOwnerId:selectedTruckOwner}),
        });

    const result = await res.json();
    console.log("manual Assing data",result);
   if(result.success){
  
     Swal.fire({
          title: "Approved",
          text: "Assign SuccessFully",
          icon: "success",
          confirmButtonText: "OK",
         
        }).then(() => {
setSelectedTruck("")
Swal.close();
// setShowTruckModal(false);
       fetchData(); 
      // setFilteredData([]); 
      router.push('/admin/loads/loadrequest/approved')
      
        })
   }else{
   
   await  Swal.fire({
          title: "Error",
          text: result.message,
          icon: "info",        
        })
   }
  }catch(err){
    alert(err)
  }finally{
    Swal.close();
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
                  <BreadcrumbLink href="/admin/loads/loadrequest/all">Loads</BreadcrumbLink>
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
           <div className="flex flex-1 flex-col gap-6  p-6">
          <div className=" ">
            {/* <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
              Request Details
            </h1> */}

            {/* ---------- Sections ---------- */}
            <div className="grid grid-cols-2 border shadow-lg p-3 rounded-2xl ">
                        

              {/* Request Info */}
   
              <div className="col-span-2   pb-4 border-b">
                   <p><span className="font-bold text-center text-sm">Request ID:</span> {singleRequest._id}</p>
                <p><span className="font-bold">Status:</span> {singleRequest.requestStatus}</p>
                <p><span className="font-bold">Delivery Status:</span> {singleRequest.deliveryStatus}</p>

              </div>

                <div className="col-span-2">
                    <h2 className="  md:text-lg text-center font-semibold my-2">Customer Details </h2>
                    <p><span className="text-sm font-medium">Name:{singleRequest.customerId?.name}</span> </p>
                <p><span className="text-sm font-medium">Email:</span> {singleRequest.customerId?.email}</p>
                <p><span className=" text-sm font-medium">Phone:</span> {singleRequest.customerId?.phone}</p>
                </div>

   

                <div className="border text-center ">
                     <h2 className="text-lg font-semibold bg-red-800 text-center text-white mb-3 border-b">Pickup Details</h2>
                <p className="border-b"><span className="font-medium ">State:</span> {singleRequest.pickupState}</p>
                <p className="border-b"><span className="font-medium ">City:</span> {singleRequest.pickupCity}</p>
                <p className="border-b"><span className="font-medium ">Address:</span> {singleRequest.pickupAddress}</p>
                </div>

                <div className=" border text-center">
                       <h2 className="text-lg text-center bg-red-800 text-white font-semibold mb-3">Drop Details</h2>
                <p className="border-b"><span className="font-medium ">State:</span> {singleRequest.dropState}</p>
                <p className="border-b"><span className="font-medium ">City:</span> {singleRequest.dropCity}</p>
                <p className="border-b"><span className="font-medium ">Address:</span> {singleRequest.dropAddress}</p>
                </div>

                <div className="col-span-2 border-b py-3">
                    <h2 className="text-lg font-semibold mb-3">Load Details</h2>
                <p><span className="font-medium">Type:</span> {singleRequest.loadType}</p>
                <p><span className="font-medium">Weight:</span> {singleRequest.loadWeight} kg</p>
                </div>


     <div className="col-span-2">
                    <h2 className="text-lg font-semibold my-3 text-center">Truck Owner Details</h2>
                <p><span className="font-medium">Name:</span> {singleRequest.acceptedByTruckOwnerId?.name}</p>
                <p><span className="font-medium">Email:</span> {singleRequest.acceptedByTruckOwnerId?.email}</p>
                <p><span className="font-medium">Phone:</span> {singleRequest.acceptedByTruckOwnerId?.phone}</p>
               {/* <p className="font-medium">Truck Details :{singleRequest?.acceptedTruckId?.truckNumber}</p> */}
                        <p className="font-medium">Truck Details :{singleRequest?.assignedTruckId?.truckNumber || singleRequest?.acceptedTruckId?.truckNumber}</p>
                <p><span className="font-medium">Type:</span> {singleRequest?.assignedTruckId?.truckType || singleRequest?.acceptedTruckId?.truckType}</p>
                <p><span className="font-medium">capacity:</span> {singleRequest?.assignedTruckId?.capacity || singleRequest?.acceptedTruckId?.capacity} </p>
                </div>

              
             
              

            

               

                {/* Dates */}
            <div className="mt-8 border-t pt-4 text-sm text-gray-500 flex flex-col gap-1 col-span-2">
              <p><b>Created:</b> {new Date(singleRequest.createdAt).toLocaleString()}</p>

            </div>

            <div className="col-span-2">
                            {singleRequest.requestStatus =="Pending" && (
                <div className="flex justify-end gap-2">
                  
      <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={fetchTruckOwnerData}>Assign Truck</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Truck</DialogTitle>
          
          </DialogHeader>
          <div className="grid gap-4">

             
            <div className="grid gap-3">
              <Label htmlFor="name-1">Select Truck Owner Number</Label>
              <Select required value={selectedTruckOwner} onValueChange={(value) =>{setSelectedTruckOwner(value);fetchTrucksByOwner(value)} } 
              
              >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Truck Owner" />
             </SelectTrigger>
                <SelectContent>
                  {truckOwners.map((trucksOwner)=>(

                     <SelectItem key={trucksOwner._id} value={String(trucksOwner._id)} >{trucksOwner.name}- {trucksOwner.phone}</SelectItem>
                  ))}
             
               </SelectContent>
              </Select>
              
            </div>
            <h1>Select Truck</h1>
                <div className="mb-2">
                <RadioGroup
              value={selectedTruck}
              onValueChange={(value) => setSelectedTruck(value)}
                  className="flex flex-col space-y-2"
                >
                  {trucks.length > 0 ? (
                    trucks.map((truck: any) => (
                      <div key={truck._id} className="flex items-center space-x-2">
                        <RadioGroupItem value={truck._id} id={truck._id} />
                        <Label htmlFor={truck._id}>
                          {truck.truckNumber} — {truck.truckType}/ {truck.capacity} /
                          {truck.status}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p>No trucks available</p>
                  )}
                </RadioGroup>
            </div>
           
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmitAssign}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    <Button onClick={handleReject}>Rejected</Button>
                </div>
                
)} 
              
               {singleRequest.requestStatus =="Accepted" && (
                <div className="flex justify-end gap-2">
                   <Button variant='outline' onClick={handleApproved}>Approved</Button>
                                     <Button onClick={handleReject}>Rejected</Button>
                </div>
                
)} 
            </div>
             
        

            </div>

            
          </div>
        </div>
        
      </SidebarInset>
    </SidebarProvider>
  );
}

/* ------------------ Reusable Info Card ------------------ */

