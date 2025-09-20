"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForgetForm } from "./forget-form";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { CiLock } from "react-icons/ci";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useState } from "react";
import { OTPForm } from "./otp-form";
import { ResetPassword } from "./reset-password-form";


export default function LoginPage() {
// const [step , setStep] = //useState("forget");
 const [step, setStep] = useState<"forget" | "otp" | "reset">("forget");
 const [email ,setEmail] =useState("");
  return (
    <>
    <div className="flex justify-center items-center min-h-svh">
      <div className="container  mx-auto   items-center justify-between place-items-center gap-6 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2   ">
        <div className="flex  flex-col gap-4  ">
          <h1 className="scroll-m-20  text-4xl font-bold tracking-tight text-balance">
            Account Recovery
          </h1>
          <p className="text-muted-foreground text-xl">
            Securely reset your password in three simple steps. We'll send you a
            one-time password to verify your email, then you can set a new
            password for your account.
          </p>
          <div className="flex gap-2">
            <Avatar> <AvatarFallback className="bg-black text-white">1</AvatarFallback> </Avatar>
            <div> <div className="text-lg font-semibold">Verify Email</div> <p className="text-muted-foreground text-sm">Enter your email address. </p>  </div>
          </div>
          <div className="flex gap-2">
            <Avatar> <AvatarFallback className="bg-black text-white">2</AvatarFallback> </Avatar>
            <div> <div className="text-lg font-semibold">Enter OTP</div> <p className="text-muted-foreground text-sm">Enter the 6-digit code sent to your email </p>  </div>
          </div>
          <div className="flex gap-2">
            <Avatar> <AvatarFallback className="bg-black text-white">3</AvatarFallback> </Avatar>
            <div> <div className="text-lg font-semibold">New Password</div> <p className="text-muted-foreground text-sm">Create a new secure password</p>  </div>
          </div>
        </div>

        <div className="w-full max-w-md border-2 p-6 md:py-12 shadow-sm rounded-2xl ">
        
       <div className="flex  justify-around  items-center gap-2 ">
        <div className="">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Secure your account with a new password
        </p>
       
        </div>
 <Avatar >
      
      <AvatarFallback >
        <CiLock size={24} />
      </AvatarFallback>
    </Avatar>
      </div>
      <hr  className="my-5" />
        { step === "forget" && <ForgetForm   onNext={() => setStep("otp")} setEmail={setEmail}  />}
        { step === "otp" && <OTPForm  onNext={() => setStep("reset")} email={email} />}
        { step === "reset" && <ResetPassword  onNext={() => setStep("reset")} email={email} />}
      <hr className="my-5" />
      <div className="text-center text-sm">
       Remember your password ? {" "}
        <Link href="/account/login" className="underline underline-offset-4">
         Sign in
        </Link>
      </div>
        </div>
      </div>
      </div>
    </>
  )
}
