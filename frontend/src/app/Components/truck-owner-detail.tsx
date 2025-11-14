"use client"

import { useCallback, useEffect } from "react";
import TruckForm from "./truck-form";


export default function TruckOwnerDetail({ id }: { id?: string }) {
 
     const fetchData =  useCallback( async () => {
            const token = localStorage.getItem("token");
         
            if (!token) return;
        const url=process.env.NEXT_PUBLIC_URL_BASE;
            const res = await fetch(`${url}api/trucks/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
        
            const result = await res.json();
            console.log(result);    
        
          },[id]);
        
          useEffect(() => {
            fetchData();
          }, [fetchData]);
      return (
    <div>
     hello {id}
     <TruckForm id={id} />
    </div>
  )
}
