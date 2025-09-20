"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

const HeroBanner = () => {
  return (
    <section
      className="relative h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center overflow-hidden text-white px-6"
      style={{ backgroundImage: "url('/truckimg.jpg')" }} // replace with your image path
    >
      {/* Overlay with rgba */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to Logistic Solution
        </h1>
        <div className="mt-6 flex justify-center gap-4">
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
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
