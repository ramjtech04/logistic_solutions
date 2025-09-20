"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [name,setname]=useState("");
  const [email,setemail]=useState("");
  const [phone,setphone]=useState("");
  const [password,setpassword]=useState("");
  const [role,setrole]=useState("customer");
    const handleRegister = async (e: React.FormEvent) => {
       
       e.preventDefault();
  
    
  const url=process.env.NEXT_PUBLIC_URL_BASE;
      try {
        const res = await fetch(url+"api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name,email,phone, password,role }),
        });
  
        const data = await res.json();
       
       
        if (!res.ok) {
            alert(data.message)
          throw new Error(data.errors[0].msg || "Login failed");
        
        }else{
  alert(data.message);
          window.location.href = "/account/login"; 
        }
        
        
       
      } catch (err) {
     
      }
    };
  return (
    <form onSubmit={handleRegister} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">SignUp to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
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
          onChange={(e) => setemail(e.target.value)}/>
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
            <Label htmlFor="password">Password</Label>
           
          </div>
          <Input id="password" type="password" required
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          />
         
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Role</Label>
           
          </div>
          
           
          <Select  value={role}
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

        <Button type="submit" className="w-full">
          Sign up
        </Button>
       
     
      </div>
      <div className="text-center text-sm">
        Already Have Account ?{" "}
        <Link href="login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  )
}
