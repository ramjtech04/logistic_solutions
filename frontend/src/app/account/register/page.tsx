// import { SignUpForm } from '@/app/Components/sign-up'
"use client"
import dynamic from "next/dynamic";
import Image from 'next/image'
const SignUpForm = dynamic(
  () => import('@/app/Components/sign-up').then(mod => mod.SignUpForm),
  { ssr: false, loading: () => <p>Loading form...</p> }
);
import Link from 'next/link'
import React from 'react'

const SignUppage = () => {
  return (
  <>

   <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex  gap-2 justify-center md:justify-start">
            <Link href="/" className=" flex items-center ">
                  
                <Image
                            src="/v1.jpg"
                            alt="Logo"
                            width={25}
                            height={25}
                            priority
                            className="mr-2"
                          />
                 <span className="text-sm font-bold text-dark-600 ">LOGISTIC</span><span className=" text-sm  text-dark-600">SOLUTION</span>
                 
                  </Link>
        </div>
        <div className="flex flex-1 md:items-center justify-center">
          <div className="w-full max-w-xs">
      <SignUpForm/>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
         <Image
                  src="/login1.jpg"
                  alt="Truck Image"
                  fill
                  className="object-cover dark:brightness-[0.2] dark:grayscale"
                  priority
                />
      </div>
    </div>
  </>
  )
}

export default SignUppage
