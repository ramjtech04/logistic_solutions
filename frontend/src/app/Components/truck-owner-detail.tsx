"use client"
import { usePathname } from "next/navigation"
import { useEffect } from "react";
import TruckForm from "./truck-form";


export default function TruckOwnerDetail({ id }: { id?: string }) {
    const pathanme =usePathname()
     const fetchData = async () => {
            const token = localStorage.getItem("token");
         
            if (!token) return;
        const url=process.env.NEXT_PUBLIC_URL_BASE;
            const res = await fetch(`${url}api/trucks/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
        
            const result = await res.json();
            console.log(result);    
            
            // setname(result.data.name);
            // setemail(result.data.email);
            // setphone(result.data.phone);
            // setrole(result.data.role);
          };
        
          useEffect(() => {
            fetchData();
          }, []);
      return (
    <div>
     hello {id}
     <TruckForm id={id} />
    </div>
  )
}
