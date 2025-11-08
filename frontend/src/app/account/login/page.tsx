"use client"
// import { LoginForm } from '@/app/Components/login-form'
import dynamic from "next/dynamic";
import Image from 'next/image'
import Link from 'next/link'
const LoginForm = dynamic(
  () => import('@/app/Components/login-form').then(mod => mod.LoginForm),
  { ssr: false, loading: () => <p>Loading form...</p> }
);

const Loginpage = () => {
  return (
  <>

   <div className="grid lg:min-h-svh  grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          
           <Link href="/" className=" flex items-center ">
        
        
          <Image
              src="/v1.jpg"
              alt="Logo"
              width={25}
              height={25}
              priority
              className="mr-2"
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
       
          <Image
          // src="/truckimg.jpg"
          src='/login1.jpg'
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

export default Loginpage
