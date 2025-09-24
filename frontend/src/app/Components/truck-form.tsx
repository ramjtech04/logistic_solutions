"use client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const TruckForm = ({ id }: { id?: string }) => {

      
          const title = id==="add" ? "Add Truck" : "Edit Truck"
          const urladd = id==="add" ? "api/trucks/" : "api/trucks/"+id
          const method = id==="add" ? "POST" : "PUT"
          const btn = id==="add" ? "Add Truck" : "Update Truck"
     const[truckNumber ,setnumber]=useState("");
     const[truckType ,settrucktype]=useState("");
     const[capacity ,setcapacity]=useState("");
     const[city ,setcity]=useState("");
 const[state ,setstate]=useState("");
  const[fuelType ,setfueltype]=useState("");
  const router =useRouter();
    const[truckOwnerId ,settruckOwnerId]=useState(localStorage.getItem("userId") || "");

     const fetchData = async () => {
        const token = localStorage.getItem("token");
      
        if (!token) return;
    const url=process.env.NEXT_PUBLIC_URL_BASE;
        const res = await fetch(`${url}${urladd}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const result = await res.json();
      
console.log(result.data.truckNumber+" "+result.data.truckType);

if (result?.data) {
    setnumber(result.data.truckNumber || "");
    settrucktype(result.data.truckType || "");
    setcapacity(result.data.capacity || "");
    setstate(result.data.state || "");
    setcity(result.data.city || "");
    setfueltype(result.data.fuelType || "");
  }else{
    setnumber("")
 settrucktype("");
    setcapacity("");
    setstate("");
    setcity("");
    setfueltype("");

  }
      };
    
      useEffect(() => {
        fetchData();
      }, []);


const handleSubmit  =  async(e: React.FormEvent) => {
    e.preventDefault();
    // Yahan par aap form data ko submit karne ka logic likh sakte hain
 
     const url=process.env.NEXT_PUBLIC_URL_BASE;
      try {
        const res = await fetch(url+urladd, {
          method: method,
          headers: {
            "Content-Type": "application/json",
             "Authorization":   `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({truckNumber,truckType,capacity,state,city,fuelType,truckOwnerId}),
        });
  
        const data = await res.json();
       
       
        if (!res.ok) {
            alert(data.message)
            console.log(data);
          throw new Error(data.errors[0].msg || "error found");
        
        }else{
  alert(data.message);
  console.log(data);
  
           

         
        }
        
        
       
      } catch (err) {
     
      }
  }
 const handleClear =()=>{
    setnumber("")
    setcapacity("")
    setfueltype("")
    settrucktype("")
    setstate("")
    setcity("")
 }
  return (
    <>
      <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/trucks">Trucks</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb> 
    <form onSubmit={handleSubmit}>
        <Card className="w-full border-0 shadow-none ">
                
     
         <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        
        <CardDescription>{title} information</CardDescription>
      </CardHeader>
      <CardContent>
      

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div className="flex flex-col  gap-3">
                <Label htmlFor="name">Truck Number</Label>
                <Input id="number" type="text" placeholder="Enter Truck number (e.g., MH12AB1234)"  
                value={truckNumber}  
                onChange={(e) => setnumber(e.target.value)} required/>
              </div>
              <div className="flex flex-col  gap-3">
                <Label htmlFor="text">Truck Type</Label>
    <Select required value={truckType} onValueChange={(value) => settrucktype(value)}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select TruckType" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="open" >Open</SelectItem>
    <SelectItem value="container">Container</SelectItem>
    <SelectItem value="trailer">Trailer</SelectItem>
    <SelectItem value="refrigerated">Refrigerated</SelectItem>
  </SelectContent>
</Select>
              </div>
              <div className="flex flex-col  gap-3">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" placeholder="eg 10,20,30" value={capacity}   onChange={(e) => setcapacity(e.target.value)} required/>
              </div>
               <div className="flex flex-col  gap-3">
                <Label htmlFor="fulltype">FuelType</Label>
                 <Select required value={fuelType} onValueChange={(value) => setfueltype(value)}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select FullType" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="diesel">Diesel</SelectItem>
    <SelectItem value="petrol">Petrol</SelectItem>
    <SelectItem value="cng">CNG</SelectItem>
    <SelectItem value="electric">Electric</SelectItem>
  </SelectContent>
</Select>
          
              </div>
              <div className="flex flex-col  gap-3">
                <Label htmlFor="state">state</Label>
                <Input id="state" placeholder="state" value={state}  onChange={(e) => setstate(e.target.value)}  required/>
              </div>
              <div className="flex flex-col  gap-3">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="city" value={city}  onChange={(e) => setcity(e.target.value)}  required/>
              </div>
              
               


            </div>
           
          
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button className="px-6 me-2" >{btn}</Button>
        {id ==="add" && <Button className="px-6 bg-sky-500 hover:bg-sky-800 text-white me-2" onClick={handleClear} >clear</Button>} 
        <Button type="button" className="px-6 bg-gray-500 text-white hover:bg-gray-600" onClick={()=>{router.push('/trucks')}} >Back</Button>
      </CardFooter>
      
    </Card>
     </form>
    </>
     
  )
}

export default TruckForm