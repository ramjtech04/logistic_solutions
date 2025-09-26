import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { FiLoader } from "react-icons/fi";
import Swal from 'sweetalert2'
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { useState } from "react"



export function ForgetForm({
  className,
  onNext,

  setEmail,
  ...props
}: React.ComponentProps<"form">& { onNext: () => void;setEmail:(email:string)=>void } ) {

const [loader ,setloader]=useState(false);
    const handleSubmit = async(e: React.FormEvent) => {
        // setloader(true);
         Swal.fire({
             title: "Please wait...",
             text: "Submitting your request",
             allowOutsideClick: false,
             didOpen: () => {
               Swal.showLoading()
             }
           }); 
         e.preventDefault();      
  const emailInput = (e.target as HTMLFormElement).email as HTMLInputElement;
  const email = emailInput.value;
     setEmail(email);
  console.log("Email submitted:", email);
  try{
  const url=process.env.NEXT_PUBLIC_URL_BASE;  
      const response = await fetch(`${url}api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email}), 
      });

    
      const data = await response.json();
      console.log("✅ Server Response:", data);
    if(!response.ok){
      await  Swal.fire({
            title: "Failed",
            text: data.message || "Something went wrong",
            icon:"info"
          });
      
        return;
    }else{
        setloader(false);
        Swal.close();
    if (onNext) onNext();
    }
}catch(err){
    console.log("❌ Error:", err);
    alert("Something went wrong. Please try again later.");
} finally{
    setloader(false);
    Swal.close();
}
    

    }
  return (
   
    <form className={cn("flex flex-col gap-6", className)}onSubmit={handleSubmit} {...props}>
        {loader && (<div className="flex justify-center items-center ">
            <FiLoader /> Wait for few seconds...
        </div>)}
      <Alert  className="bg-sky-100 mb-4">
     
        <AlertDescription>
         Enter the email address associated with your account. We'll send you a verification code.
        </AlertDescription>
      </Alert>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
       
        <Button type="submit" className="w-full ">
        Send Verification Code
        </Button>
        

      </div>
     
    </form>
  )
}
