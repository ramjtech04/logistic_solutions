"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

const HeroBanner = () => {
  return (
    <section
      className="relative  flex  flex-col md:flex-row   justify-center place-items-center   bg-red-500 py-10 bg-no-repeat bg-cover bg-center overflow-hidden text-white px-6"
      // replace with your image path

    >
      
      {/* Overlay with rgba */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>

     

    <div className=" relative z-10  ">
   {/* <img src="/ls.png" alt="image" className=" "  /> */}
   <img src="indianbg1.png" alt="" />
    </div>
   
    {/* Content */}
      <div className="relative z-10 flex-inline flex-col space-y-4 text-center  md:w-2/4">
     
        
         <h1 className="text-center text-2xl sm:text-4xl font-bold tracking-wide  ">
           Welcome To  Logistic Solution - Your Trusted FLeet Owners & Transport Contractors
    </h1>
       <p className="text-white text-xl ">
    
    Your One-Stop Solution for Fleet & Transport Contractors Across India.
    </p>
        <Button className="bg-white hover:bg-white text-red-800 border-red-500 fw-bold rounded-full " ><Link href={'/account/login'}>Get Started !</Link></Button>
        {/* <div className="mt-6 flex justify-center gap-4">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
            <Link href="Loadmanage/add-load-manage">  Add Load
         
            </Link>
           
          </Button>
          <Button
            variant="outline"
            className="border-white bg-white text-indigo-600 hover:text-indigo-600"
          >
             <Link href="Loadmanage/find-load-manage">   
              Find Load
             
             </Link>
              
          </Button>
        </div> */}
      </div>

    </section>
  )
}

export default HeroBanner
