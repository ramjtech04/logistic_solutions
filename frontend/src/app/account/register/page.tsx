import { SignUpForm } from '@/app/Components/sign-up'
import Link from 'next/link'
import React from 'react'

const SignUppage = () => {
  return (
  <>

   <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex  gap-2 justify-center md:justify-start">
            <Link href="/" className=" flex items-center ">
                  
                     <img
                    src="/v1.jpg"
                    alt="Image"
                    className=" h-[25px]   sm:h-[25px] mr-2"
                    
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
        <img
          src="/truckimg.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  </>
  )
}

export default SignUppage
