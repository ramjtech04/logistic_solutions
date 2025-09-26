"use client";

import Navbar from "@/app/Components/Navbar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Swal from 'sweetalert2';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
interface FormData {
 
  pickupcity: string;
  dropcity: string;

}

const TruckForm: React.FC = () => {
    const [data, setData] = useState<any[]>([]); 
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const router =useRouter();
const [showTruckModal, setShowTruckModal] = useState(false);
const [trucks, setTrucks] = useState<any[]>([]);
const [selectedTruck, setSelectedTruck] = useState<string>("");
const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    pickupcity: "",
  dropcity: "",

  });
 const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;
const url=process.env.NEXT_PUBLIC_URL_BASE;

    const res = await fetch(`${url}api/requests/available`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
   
  console.log(result)
  
    setData(result.requests);
  };

 
 useEffect(() => {
  if (typeof window !== "undefined") {
    const role = localStorage.getItem("role");
    if (role === "null" || role === "customer") {
      alert("For this page, access needs a truck account");
      router.push("/");
    } else {
      fetchData();
    }
  }
}, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     if (!formData.pickupcity && !formData.dropcity) {
    setFilteredData([]);
    
    return;
  }
   
    console.log(formData);
    const filtered = data.filter((req) => {
    const pickupMatch = formData.pickupcity
      ? req.pickupCity.toLowerCase() === formData.pickupcity.toLowerCase()
      : true;
    const dropMatch = formData.dropcity
      ? req.dropCity.toLowerCase() === formData.dropcity.toLowerCase()
      : true;
   
    return pickupMatch && dropMatch ; // AND condition
  });

  setFilteredData(filtered);
 
  };
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const formattedTime = date.toLocaleTimeString("en-GB"); // HH:MM:SS
  return `${formattedDate} ${formattedTime}`;
};
const handleAcceptLoad = async (id: string) => {
  console.log("Accepted load with changed ID:", id);
  // Perform your logic here, e.g., API call
  try{
         const token = localStorage.getItem("token");
       console.log("token "+token)
        if (!token) return;
    const url=process.env.NEXT_PUBLIC_URL_BASE;
    
        const res = await fetch(`${url}api/requests/my-available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const result = await res.json();
     
         setTrucks(result.trucks || []);
    setSelectedRequestId(id);
   
    setShowTruckModal(true);  
      }catch(err){
console.log(err)
      }
};

const handleSubmitTruck = async()=>{
   const token = localStorage.getItem("token");
if(selectedTruck==""){

  Swal.fire({  text: "select Truck", })
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
    const res = await fetch(`${url}api/requests/accept/${selectedRequestId}`, 
     {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
             "Authorization":   `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({truckId:selectedTruck}),
        });

    const result = await res.json();
   if(result.success){
  
   await  Swal.fire({
          title: "Accepted",
          text: "Please Wait for Admin Approval for customer  information",
          icon: "success",
          confirmButtonText: "OK",
         
        }).then(() => {
setSelectedTruck("")
setShowTruckModal(false);
       fetchData(); 
      setFilteredData([]); 
      
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
const handCLoseMOdel =()=>{
setShowTruckModal(false)
setSelectedTruck("")
}
  return (
    <>
    <Navbar />
    <div className="container mx-auto my-5 ">
      <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Find Load</BreadcrumbPage>
                </BreadcrumbItem>
            
              </BreadcrumbList>
            </Breadcrumb>
    <div className="max-w-3xl mx-auto p-8   rounded-xl border shadow ">
      
      <h2 className="text-2xl font-semibold text-center mb-2">Find Load</h2>
      <p className="text-red-800 text-sm text-bold text-center lh-lg mb-2"><small>To find the Load of your Truck,Please Provide the Following details.</small></p>
      <form onSubmit={handleSubmit} className="space-y-4">

       
        {/* Source & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="source">From</Label>
            <Input
              id="source"
              name="pickupcity"
              value={formData.pickupcity}
              onChange={handleChange}
              placeholder="Search City"
              
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="destination">To</Label>
            <Input
              id="destination"
              name="dropcity"
              value={formData.dropcity}
              onChange={handleChange}
              placeholder="Search City"
              
            />
          </div>
        </div>

       


        {/* Submit */}
        <Button type="submit"  className="w-full mt-2">
          Find Load
        </Button>
      </form>
      </div>
    </div>

<div className="container mx-auto mt-8">
  <h2 className="text-xl font-semibold mb-4">Available Load Requests</h2>
  {filteredData.length > 0 ? (
    <ul className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-5">
      {filteredData.map((request: any) => (
        <li key={request._id} className="p-4 border rounded shadow">
          <p><small className="text-gray-400">{formatDate(request.createdAt)}</small></p>
          <p><strong>Source Location:</strong>{request.pickupCity}</p>
          <p><strong>Destination Location:</strong> {request.dropCity}</p>
          <p className="text-red-800  text-md"><strong> {request.loadType}/{request.loadWeight}</strong></p>
          
          <Button variant={'outline'}   onClick={() => handleAcceptLoad(request._id)} >Accept Load</Button>
        </li>
      ))}
    </ul>
  ) : (
    <p>No requests found.</p>
  )}
</div>

{
  showTruckModal && (
    <>
<div className="fixed inset-0 bg-white bg-opacity-100 flex  justify-center items-center">
   <div className="bg-white p-6 rounded shadow-lg w-96">
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
              {truck.truckNumber} — {truck.truckType}
            </Label>
          </div>
        ))
      ) : (
        <p>No trucks available</p>
      )}
    </RadioGroup>
</div>
<Button variant={'outline'} onClick={handleSubmitTruck}>Submit</Button>
<Button onClick={handCLoseMOdel}>CLose</Button>
    </div>
    </div>
    </>
  )
}
    </>
  );
};

export default TruckForm;
