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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
const Profilepage = () => {
     const[name ,setname]=useState("");
     const[email ,setemail]=useState("");
     const[phone ,setphone]=useState("");
     const[role ,setrole]=useState("");

     const fetchData = async () => {
        const token = localStorage.getItem("token");
     
        if (!token) return;
    const url=process.env.NEXT_PUBLIC_URL_BASE;
        const res = await fetch(`${url}api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const result = await res.json();
        console.log(result);    
        
        setname(result.data.name);
        setemail(result.data.email);
        setphone(result.data.phone);
        setrole(result.data.role);
      };
    
      useEffect(() => {
        fetchData();
      }, []);


const handleSubmit  =  async(e: React.FormEvent) => {
    e.preventDefault();
    // Yahan par aap form data ko submit karne ka logic likh sakte hain
 
     const url=process.env.NEXT_PUBLIC_URL_BASE;
      try {
        const res = await fetch(url+"api/users/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
             "Authorization":   `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({name,email,phone}),
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
        console.log(err);
     
      }
  }
  return (
    <>
      
    <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-xl mx-auto  my-2 shadow-none md:shadow-lg md:rounded-2xl sm:border-0">
                
      <CardHeader className="flex flex-col items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/Sample_User_Icon.png" alt="Profile" />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4">Account Settings</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name"  value={name}  onChange={(e) => setname(e.target.value)} required/>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email}  onChange={(e) => setemail(e.target.value)} required/>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+91 9876543210" value={phone}   onChange={(e) => setphone(e.target.value)} required/>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="Role" value={role} disabled onChange={(e) => setrole(e.target.value)}  required/>
              </div>
              
            </div>
           
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button className="px-6" >Save Changes</Button>
      </CardFooter>
      
    </Card>
     </form>
    </>
     
  )
}

export default Profilepage