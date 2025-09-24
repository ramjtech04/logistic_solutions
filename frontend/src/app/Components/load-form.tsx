"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@radix-ui/react-label'
import {  useState } from 'react'
import Swal from 'sweetalert2';

export default function LoadRequestForm() {
    const [pickupAddress,setpickupaddress]=useState("");
    const [pickupCity,setpickupCity]=useState("");
    const [pickupState,setpickupState]=useState("");
    const [dropAddress,setdropaddress]=useState("");
    const [dropCity,setdropcity]=useState("");
    const [dropState ,setdropstate]=useState("");
    const [loadType,setloadtype]=useState("");
    const [loadWeight,setloadweight]=useState("");   
const handleSubmit  =  async(e: React.FormEvent) => {
    e.preventDefault();
   
      try {
      
          const url=process.env.NEXT_PUBLIC_URL_BASE;
          const customerId =localStorage.getItem("userId")
            const role =localStorage.getItem("role")
            console.log("Id is :"+customerId)
            if(customerId ==null){
                
             await    Swal.fire({
              title:"Login",
              text:"First you need to login as Customer Account",
              icon: "error",
             footer: '<a href="/account/login">Login IN</a>'
    
            });
            return;
             
            }
          if(role =="truck_owner"){
           
            await Swal.fire({
              title:"Login",
              text:" you are Login as Truck Owner Account Yoou nedd to Login as Customer Account For Loads",
              icon: "info",
             footer: '<a href="/account/login">Login IN</a>'
     
            })
            return
          }
        
       Swal.fire({
      title: "Please wait...",
      text: "Submitting your request",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
        const res = await fetch(url+"api/requests/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             "Authorization":   `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({customerId,pickupState,pickupCity,pickupAddress,dropState,dropCity,dropAddress,loadType,loadWeight}),
        });
  
        const data = await res.json(); 
      console.log(data)
      if(data.success){   
        await  Swal.fire({
              title: data.success ? "Success" : "Error",
              text: data.message,
              icon: data.success ? "success":"error",
              confirmButtonText: "OK",
            }).then(() => {
             setpickupCity("")
             setpickupState("")
             setpickupaddress("")
             setdropaddress("")
             setdropcity("")
             setdropstate("")
             setloadtype("")
             setloadweight("")
          
            })

        
      }
        
        
       
      } catch (err) {
     console.log(err)
      alert(err)
      }
      finally{
    Swal.close()
  }
  }
  
  return (
 <>

    <div>
         <Card className="max-w-3xl mx-auto mt-10  border-none  shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add Load</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
              <Label>Pickup Address</Label>
              <Textarea name="pickupAddress" placeholder="Full pickup address" required 
              value={pickupAddress}   onChange={(e) => setpickupaddress(e.target.value)}
              />
            </div>
<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <div>
              <Label>Pickup City</Label>
              <Input name="pickupCity" placeholder="e.g. Delhi" required
                      value={pickupCity}   onChange={(e) => setpickupCity(e.target.value)}
              />
            </div>

<div>
              <Label>Pickup State</Label>
              <Input name="pickupstate" placeholder="e.g. Madhya Pradhesh" required 
       value={pickupState}   onChange={(e) => setpickupState(e.target.value)}
              />
            </div>
            </div>

             <div>
              <Label>Drop Address</Label>
              <Textarea name="dropAddress" placeholder="Full drop address" required
               value={dropAddress}   onChange={(e) => setdropaddress(e.target.value)}
              />
            </div>

<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <div>
              <Label>Drop City</Label>
              <Input name="dropCity" placeholder="e.g. Mumbai" required 
                      value={dropCity}   onChange={(e) => setdropcity(e.target.value)}
              />
            </div>
             <div>
              <Label>Drop State</Label>
              <Input name="dropstate" placeholder="e.g. Madhya Pradesh" required 
                      value={dropState}   onChange={(e) => setdropstate(e.target.value)}
              />
            </div>
           </div>
<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <div>
              <Label>Load Type</Label>
              <Input name="loadType" placeholder="e.g. FMCG, Cement" required
              value={loadType}   onChange={(e) => setloadtype(e.target.value)}
              />
            </div>

            <div>
              <Label>Weight (in Tons)</Label>
              <Input name="weight" type="number" placeholder="e.g. 10" required
              value={loadWeight}   onChange={(e) => setloadweight(e.target.value)}
              />
            </div>
</div>
        
           
           
          

            <Button type="submit" className="w-full">Submit Load</Button>
          </form>
        </CardContent>
      </Card>
    </div>
     </>
  )
}
