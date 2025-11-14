"use client"
import React, { useCallback, useEffect, useState } from 'react'
import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaPen } from 'react-icons/fa6';
interface Truck {
  _id: string;
  truckNumber: string;
  truckType: string;
  status: string;
  capacity: string;
  fuelType: string;
  city: string;
  state: string;
}

export default function Specific_trucks({ truck_owner }: { truck_owner: string }) {
   
    const [data, setData] = useState<Truck[]>([]);
    localStorage.getItem("role")
    
         const fetchData = useCallback( async () => {
        
            const token = localStorage.getItem("token");
          
            if (!token) return;
        const url=process.env.NEXT_PUBLIC_URL_BASE;
            const res = await fetch(`${url}api/trucks/owner/${truck_owner}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
        
            const result = await res.json();
            console.log(result)
            setData(result?.data);
   
          },[truck_owner]);
    
    
    
        
          useEffect(() => {
        
            fetchData();
            
               
              
         
          }, [fetchData]);


    
  return (
   <>
<div className="px-4 py-2 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Total Trucks: {data.length}
        </h2>
 <Button className='bg-black text-white hover:bg-black'> <Link href={`/trucks/add/${truck_owner}`}>ADD</Link></Button>
      </div>
   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {data.length === 0 ? (
        <p className="text-gray-500">No trucks found.</p>
      ) : (
        
        data.map((truck, index) => (
         <Card
  key={index}
  className="shadow-md hover:shadow-xl  rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50"
>
  <CardHeader className="text-center border-b pb-4">
    <CardTitle className="text-xl font-semibold text-gray-800">
      🚛 {truck.truckNumber || "Unknown Truck"}
    </CardTitle>
    <CardDescription className="text-gray-500 text-sm mt-1">
      Type: {truck.truckType || "Not Available"}
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-2 py-4">
    <div className="flex justify-between text-gray-700">
      <span className="font-medium">Status:</span>
      <span className="text-gray-600">{truck.status || "N/A"}</span>
    </div>

    <div className="flex justify-between text-gray-700">
      <span className="font-medium">Capacity:</span>
      <span className="text-gray-600">{truck.capacity || "N/A"}</span>
    </div>

    <div className="flex justify-between text-gray-700">
      <span className="font-medium">Fuel:</span>
      <span className="text-gray-600">{truck.fuelType || "N/A"}</span>
    </div>
  </CardContent>

  <CardFooter className="flex justify-end border-t pt-3">
    <Button
      variant="outline"
      className="rounded-xl border-gray-300 text-gray-700 hover:bg-black hover:text-white transition"
    >
      <Link href={`/trucks/edit/${truck._id}`} className="flex items-center gap-2">
        <FaPen /> Edit
      </Link>
    </Button>
  </CardFooter>
</Card>

        ))
      )}
    </div>
   </>
  )
}

