"use client"
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaPen } from 'react-icons/fa6';
export default function Specific_trucks({ truck_owner }: { truck_owner: string }) {
   
    const [data, setData] = useState<any[]>([]);
    const role =localStorage.getItem("role")
    
         const fetchData = async () => {
        
            const token = localStorage.getItem("token");
          
            if (!token) return;
        const url=process.env.NEXT_PUBLIC_URL_BASE;
            const res = await fetch(`${url}api/trucks/owner/${truck_owner}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
        
            const result = await res.json();
            console.log(result)
            setData(result?.data);
   
          };
    
    
    
        
          useEffect(() => {
        
            fetchData();
            
               
              
         
          }, []);


    
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
          <Card key={index} className="shadow-lg hover:shadow-xl transition rounded-2xl" >
           
            <CardHeader>
              <CardTitle className="text-lg text-center font-semibold">
                
              Truck Number :  {truck.truckNumber || "Unknown Truck"}
              </CardTitle>
              <CardDescription className='text-center'>
            truck type :    {truck.truckType || "TruckType not available"}
              </CardDescription>
            </CardHeader>
            <CardContent>

              <p><strong>Status:</strong> {truck.status || "N/A"}</p>
              <p><strong>Capacity:</strong> {truck.capacity || "N/A"}</p>
            <p><strong>Fuel:</strong> {truck.fuelType || "N/A"}</p>
                
            </CardContent>
           <CardFooter className='flex justify-end items-center '>
          <Button  >
            <Link href={`/trucks/edit/${truck._id}`}><FaPen/></Link>
          </Button>
           </CardFooter>
          </Card>
        ))
      )}
    </div>
   </>
  )
}

