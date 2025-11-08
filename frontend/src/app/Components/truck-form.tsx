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
import Swal from 'sweetalert2'
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
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import('@/app/Components/Navbar'), { ssr: false });
const AppSidebar = dynamic(() => import("@/components/ui/app-sidebar").then(mod => mod.AppSidebar), { ssr: false });
const Separator = dynamic(() => import("@/components/ui/separator").then(mod => mod.Separator), { ssr: false });
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/ui/app-sidebar"
const TruckForm = ({ id ,mode}: { id?: string,mode?:string }) => {

         const title = mode === "add" ? "Add Truck" : mode === "edit"  ? "Edit Truck" : "Truck Details";
          const urladd = mode==="add" ? "api/trucks/" : "api/trucks/updatetruck/"+id
          const method = mode==="add" ? "POST" : "PUT"  
          const btn = mode==="add" ? "Add Truck" : "Update Truck"
       
     const[truckNumber ,setnumber]=useState("");
     const[truckType ,settrucktype]=useState("");
     const[capacity ,setcapacity]=useState("");
     const[city ,setcity]=useState("");
 const[state ,setstate]=useState("");
  const[fuelType ,setfueltype]=useState("");
    const[truckOwnerId ,settruckOwnerId]=useState("");
   
            const [data, setData] = useState<any[]>([]);
const role =localStorage.getItem("role")

     const fetchData = async () => {
    
        const token = localStorage.getItem("token");
      
        if (!token) return;
    const url=process.env.NEXT_PUBLIC_URL_BASE;
        const res = await fetch(`${url}api/trucks/fetchtruck/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const result = await res.json();
        console.log(result)
if (result?.data) {
 
    setnumber(result.data.truckNumber || "");
    settrucktype(result.data.truckType || "");
    setcapacity(result.data.capacity || "");
    setstate(result.data.state || "");
    setcity(result.data.city || "");
    setfueltype(result.data.fuelType || "");
    settruckOwnerId(result.data.truckOwnerId|| "")
    
  }else{
    setnumber("")
 settrucktype("");
    setcapacity("");
    setstate("");
    setcity("");
    setfueltype("");
  

  }
      };



       const fetchTruckOwnerData = async () => {
          const token = localStorage.getItem("token");
          if (!token) return;
      const url=process.env.NEXT_PUBLIC_URL_BASE;
      
          const res = await fetch(`${url}api/users/truck-owners`, {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          const result = await res.json();
          console.log(result)
          
          setData(result.data??"");
        };
    


  useEffect(() => {
  if (mode === "edit" || mode === "view") {
    fetchData();
  }
  fetchTruckOwnerData();
}, [id, mode]);
  useEffect(() => {
  if (mode === "add" && id) {
    settruckOwnerId(id);
  }
}, [mode, id]);





const handleSubmit  =  async(e: React.FormEvent) => {
    e.preventDefault();
    // Yahan par aap form data ko submit karne ka logic likh sakte hain
 console.log(truckOwnerId);
 
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
       console.log(data)
       
        if (data.success) {   
         Swal.fire({
                  title: "Success",
                  text: data.message,
                  icon: "success",
                  confirmButtonText: "OK",
                 
                }).then(()=>{
                  if(mode==="add"){
                   setnumber("")
                settrucktype("");
               setcapacity("");
              setstate("");
              setcity("");
               setfueltype("");
              settruckOwnerId("")
                  }
                 
                })
        }else{
           Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error", 
                  })

  
               
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
    settruckOwnerId("")
 }

 const renderForm  =()=>(
 
    <form onSubmit={handleSubmit}>
        <Card className="w-full border-0 shadow-none ">
                
     
         <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        
        <CardDescription>{title} information  {truckOwnerId}</CardDescription>
      </CardHeader>
      <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      

               

                {role == "admin" ? (<>
                 <div className="flex flex-col  gap-3">
                <Label htmlFor="text">Truck Owner </Label>
           
                   <Select required value={truckOwnerId} onValueChange={(value) => settruckOwnerId(value)}       disabled={( mode =="view" || mode =="edit") ?true:false}    >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Truck Owner" />
             </SelectTrigger>
                <SelectContent>
                  {data.map((trucksOwner)=>(

                     <SelectItem key={trucksOwner._id} value={String(trucksOwner._id)} >{trucksOwner.name}- {trucksOwner.phone}</SelectItem>
                  ))}
             
               </SelectContent>
              </Select>
               </div>

</>):(<>
   <Input id="truckOwner " type="hidden" placeholder="Truck Owner"  
                value={truckOwnerId}   disabled
                onChange={(e) => settruckOwnerId(e.target.value)} required/>
</>)}
     
             

              
              <div className="flex flex-col  gap-3">
                <Label htmlFor="name">Truck Number</Label>
                <Input id="number" type="text" placeholder="Enter Truck number (e.g., MH12AB1234)"  
                value={truckNumber}  disabled={(mode =="view") ?true:false} 
                onChange={(e) => setnumber(e.target.value)} required/>
              </div>

              
              



              <div className="flex flex-col  gap-3">
                <Label htmlFor="text">Truck Type</Label>
    <Select required value={truckType} onValueChange={(value) => settrucktype(value)}
      disabled={( mode =="view") ?true:false}
      >
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select TruckType" />
  </SelectTrigger>
  <SelectContent>
      <SelectItem value="Heavy Commerical" >Heavy Commerical Vechicles</SelectItem>
         <SelectItem value="Medium Commerical" >Medium Commerical Vechicles</SelectItem>
            <SelectItem value="Light Commerical" >Light Commerical Vechicles</SelectItem>
    <SelectItem value="open" >Open</SelectItem>
    <SelectItem value="container">Container</SelectItem>
    <SelectItem value="trailer">Trailer</SelectItem>
    <SelectItem value="refrigerated">Refrigerated</SelectItem>
  </SelectContent>
</Select>
              </div>

              <div className="flex flex-col  gap-3">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" placeholder="eg 10,20,30" value={capacity}   onChange={(e) => setcapacity(e.target.value)} required
                disabled={(mode =="view") ?true:false}
                />
              </div>
               <div className="flex flex-col  gap-3">
                <Label htmlFor="fulltype">FuelType</Label>
                 <Select required value={fuelType} onValueChange={(value) => setfueltype(value)}
                  disabled={( mode =="view") ?true:false}
                  >
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
                <Input id="state" placeholder="state" value={state}  onChange={(e) => setstate(e.target.value)}  required disabled={( mode =="view") ?true:false}/>
              </div>
              <div className="flex flex-col  gap-3">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="city" value={city}  onChange={(e) => setcity(e.target.value)}  required disabled={( mode =="view") ?true:false} />
              </div>
            
               


            </div>
           
          
      </CardContent>

      <CardFooter className="flex justify-end">
      {(mode =="add" || mode =="edit") && (<> <Button className="px-6 me-2" >{btn}</Button></>) } 
        {mode ==="add" && <Button className="px-6 bg-sky-500 hover:bg-sky-800 text-white me-2" onClick={handleClear} >clear</Button>} 
       
      </CardFooter>
      
    </Card>
     </form>
 )
  return (
    <>

   
{role =="truck_owner" ? (<> 
<Navbar />
<div className='h-[200px] md:h-[300px] bg-red-800 text-white bg-center flex flex-col items-center justify-center' style={{backgroundImage:'url(/b1.jpg)'}} >
        <h1 className=' text-2xl sm:text-5xl font-bold mb-2'>Your Trucks</h1>
        <p className='text-sm text-center'>Organize and manage your Truck efficiently to keep operations running smoothly.</p>
 
    </div>
  <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild >
          <Link href="/">Home</Link>
               
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild >
             
            <Link href="/trucks" >Trucks</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb> 
    {renderForm()}

</>):(<>
  <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
             <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink  asChild>
             <Link href="/admin/dashboard"> Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin/truck">Trucks</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb> 
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-white/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
     
      <div className='container mx-auto my-10 text-end'>

        
     {renderForm()}
            
   </div> 
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
</>)}
   
    
     

    </>
     
  )
}

export default TruckForm

