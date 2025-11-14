import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Swal from 'sweetalert2'
import {
  Alert,
  AlertDescription,
  // AlertTitle,
} from "@/components/ui/alert"

export function OTPForm({
    onNext,
    email,
  className,
  ...props
}: React.ComponentProps<"form">& { onNext: () => void ;email:string}) {
      const handleSubmit = async(e: React.FormEvent) => {
         e.preventDefault();      
  const otpInput = (e.target as HTMLFormElement).otp as HTMLInputElement;
  const otp = otpInput.value;

  const url=process.env.NEXT_PUBLIC_URL_BASE;  
      const response = await fetch(`${url}api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email,otp}), 
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
            await  Swal.fire({
                    title: "success",
                    text: data.message ||  "OTP verified successfully",
                    icon:"success"
                  });
        // alert(data.message || "OTP verified successfully");
    if (onNext) onNext();
    }
  
    
     // if (onNext) onNext()
    }
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <Alert  className="bg-sky-100 mb-4">
     
        <AlertDescription>
We&apos;ve sent a 6-digit verification code to {email} Please check your inbox and spam folder.
        </AlertDescription>
      </Alert>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="code">Verification Code</Label>
          <Input id="otp" type="text" placeholder="123456" required />
        </div>
       
        <Button type="submit" className="w-full">
        Verify Code
        </Button>
        

      </div>
    </form>
  )
}
