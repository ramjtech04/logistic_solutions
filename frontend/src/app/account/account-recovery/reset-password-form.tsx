import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import Link from "next/link"
// import {CheckCircle2Icon } from "lucide-react"
import Swal from 'sweetalert2'
import {
  Alert,
  AlertDescription,
  // AlertTitle,
} from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export function ResetPassword({
    // onNext,
    email,
  className,
  ...props
}: React.ComponentProps<"form">& { onNext: () => void ;email:string}) {
    const router = useRouter();
      const handleSubmit = async(e: React.FormEvent) => {
         e.preventDefault();      
  const NewPasswordInput = (e.target as HTMLFormElement).Newpassword as HTMLInputElement;
  const newPassword = NewPasswordInput.value;
try{


  const url=process.env.NEXT_PUBLIC_URL_BASE;  
      const response = await fetch(`${url}api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email,newPassword}), 
      });

    
      const data = await response.json();
      console.log("✅ Server Response:", data);
    if(!response.ok){
        await  Swal.fire({
                  title: "Failed",
                  text: data.message || "Something went wrong",
                  icon:"info"
                });
            
        // alert(data.message || "Something went wrong");
        return;
    }else{
         await  Swal.fire({
                            title: "success",
                            text: data.message ||  "password Changed",
                            icon:"success",
                            confirmButtonText: "OK",
                          }).then(()=>{
   router.push("/account/login");
                          })
      
     
    }
  
  }catch(err){
   console.log(err)
   alert(err)
  }finally{
    Swal.close()
  }
     // if (onNext) onNext()
    }


  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <Alert  className="bg-sky-100 mb-4">
     
        <AlertDescription>
Create a strong password with a mix of letters, numbers, and symbols.
Must have at least 6 characters .
        </AlertDescription>
      </Alert>
      <div className="grid gap-6">

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email" value={email} disabled required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="code">New  Password</Label>
          <Input id="Newpassword" type="password" placeholder="******" required />
        </div>
       
        <Button type="submit" className="w-full">
        Reset Password
        </Button>
        

      </div>
    </form>
  )
}
