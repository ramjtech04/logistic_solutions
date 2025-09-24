import React from 'react'
import { LoginForm } from '@/app/Components/login-form'
import Link from 'next/link'



const Loginpage = () => {
  return (
  <>

   <div className="grid lg:min-h-svh  grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          
           <Link href="/" className=" flex items-center ">
        
           <img
          src="/v1.jpg"
          alt="Image"
          className=" h-[25px]   sm:h-[25px] mr-2"
          
        />
       <span className=" text-sm font-bold text-dark-600 ">LOGISTIC</span><span className=" text-sm  text-dark-600">SOLUTION</span>
       
        </Link>
        </div>
        <div className="flex flex-1 md:items-center justify-center">
          <div className="w-full max-w-xs">
          <LoginForm/>
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

export default Loginpage
