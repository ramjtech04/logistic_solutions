"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function UserUpdated({mode,id}:{mode:string,id:string}) {
      const router = useRouter()

     const [name,setname]=useState("");
      const [email,setemail]=useState("");
      const [phone,setphone]=useState("");
      const [role,setrole]=useState("");
    
      
          
               const fetchData = useCallback( async () => {
              
                  const token = localStorage.getItem("token");
                
                  if (!token) return;
              const url=process.env.NEXT_PUBLIC_URL_BASE;
                  const res = await fetch(`${url}api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
              
                  const result = await res.json();
                  console.log(result)
                  setname(result.data.name)
                  setemail(result.data.email)
                    setphone(result.data.phone)
           
                   setrole(result.data.role)
         
                },[id]);
          
                useEffect(() => {
                fetchData();   }, [fetchData]);
       const handleRegister = async (e: React.FormEvent) => {
             
             e.preventDefault();
        
                  const token = localStorage.getItem("token");
        const url=process.env.NEXT_PUBLIC_URL_BASE;
            try {
               Swal.fire({
                    title: "Please wait...",
                    text: "Submitting your request",
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  });
              const res = await fetch(url+`api/users/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`  ,
                },
                body: JSON.stringify({ name,email,phone,role }),
              });
        
              const data = await res.json();
             
            if(data.success){
            
      await Swal.fire({
            title: data.success ? "Success" : "Error",
            text: data.message,
            icon: data.success ? "success":"error",
          }).then(()=>{
             router.back()
          })
            }else{
      await Swal.fire({
            title: "Error",
            text: data.message,
            icon: "error",
          })
            }
             
              
              
             
            } catch (err) {
           alert(err)
            }finally{
               Swal.close();
            }
          };
  return (
    <div>
       
       <form onSubmit={handleRegister}>
      <div className="grid max-w-md gap-6">
         <div className="grid gap-3">
          <Label htmlFor="email">Name</Label>
          <Input id="name" type="text" placeholder="Enter Your Name" required 
          value={name}
          onChange={(e) => setname(e.target.value)}
       
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required 
           value={email}
          onChange={(e) => setemail(e.target.value)}
          
          />
        </div>
         <div className="grid gap-3">
          <Label htmlFor="email">phone</Label>
          <Input id="tel" type="tel" placeholder="Enter your phone number" required 
          value={phone}
          onChange={(e) => setphone(e.target.value)}
      
          />
        </div>
       
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Role</Label>
           
          </div>
          
           
          <Select  value={role} disabled
          onValueChange={(value) => setrole(value)} required>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="customer">customer</SelectItem>
    <SelectItem value="truck_owner">Truck Owner</SelectItem>
  </SelectContent>
</Select>
        </div>

    {mode ==="Edit" && ( <Button type="submit" className="w-full "> Update  </Button>)}   
       
     
      </div>
       
      
      
    </form>
    </div>
  )
}
