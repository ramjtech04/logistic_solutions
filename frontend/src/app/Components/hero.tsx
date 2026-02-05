"use client"
import Image from "next/image"
import Link from "next/link"

const HeroBanner = () => {
  return (
    <section
      className="relative h-[500px] flex  flex-col md:flex-row   justify-center place-items-center   bg-red-500 py-10 bg-no-repeat bg-cover bg-center overflow-hidden text-white px-6"
      // replace with your image path

    >
        <Image
        src="/img/main_banner.jpg"
        alt="Hero Banner"
        fill
        priority
        className="object-cover"
      />
      
      {/* Overlay with rgba */}
      <div className="absolute inset-0 z-10 bg-black/70" ></div>

     

    {/* <div className=" relative z-10 w-full h-full ">
   <img src="/ls.png" alt="image" className=" "  />
   <img src="indianbg1.png" alt="" />
   <Image
          src="/indianbg1.png" // Next.js optimized image
          alt="Hero Banner"
          width={600} // provide width
          height={400} // provide height
          className="object-cover"
        />
        
    </div> */}
   
    {/* Content */}
      <div className="relative z-20 flex-inline flex-col space-y-4 text-center  md:w-2/3">
     
        
         <h1 className="text-center text-[20px] md:text-[32px]   font-bold font-mono tracking-wide uppercase mb-4">
           Welcome To  Logistic Solution - Your Trusted FLeet Owners & Transport Contractors
    </h1>
       <p className="text-white text-xl ">
    
    Your One-Stop Solustion for Fleet & Transport Contractors Across India.
    </p>
        <button className="bg-red-800 hover:bg-white hover:text-red-800 text-white py-2 px-6 border-red-500 fw-bold rounded-full " ><Link href={'/account/login'}>Get Started !</Link></button>
       
      </div>

    </section>
  )
}

export default HeroBanner
