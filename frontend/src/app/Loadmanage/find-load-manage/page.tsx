"use client";

import Navbar from "@/app/Components/Navbar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";


interface FormData {
 
  pickupcity: string;
  dropcity: string;

}

const TruckForm: React.FC = () => {
    const [data, setData] = useState<any[]>([]); 
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const router =useRouter();

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
const handleAcceptLoad = (id: string) => {
  console.log("Accepted load with ID:", id);
  // Perform your logic here, e.g., API call
};

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
          
          <Button variant={'outline'}   onClick={() => handleAcceptLoad(request.id)} >Accept Load</Button>
        </li>
      ))}
    </ul>
  ) : (
    <p>No requests found.</p>
  )}
</div>

    </>
  );
};

export default TruckForm;
