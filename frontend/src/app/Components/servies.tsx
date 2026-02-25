import React from 'react'
import {
  Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'




const ServicePage = () => {
  
  return (
    <>
    <section className="md:py-24 p-2 bg-red-50" id="services">
    <div className='flex flex-col  my-5 gap-3 items-center justify-center'>
       <h1 className="text-4xl font-bold  text-red-800">Our Services</h1>
       <p className=' md:w-2xl font-[500] text-sm md:text-xl text-center '>Our logistics services are designed to provide safe, fast, and cost-effective solutions for businesses of all sizes.</p>
</div>
    <div className="container  mx-auto text-center grid grid-cols-1 md:grid-cols-3 justify-center gap-6 py-10">
     
<Card className="border-red-800">
  <Link href={'/Loadmanage/add-load-manage'}>
 
  <CardContent className='flex   justify-center w-full'>

    <Image
      src="/add-load.png"                        
      alt="add-load"
      className='h-25 '
      width={100}
      height={25}
    />

  </CardContent>
  <CardHeader>
    <CardTitle className='text-center text-red-800'>Add Load</CardTitle>
    <CardDescription>Adding a load Detail connect with available trucks. </CardDescription>
  </CardHeader>
   </Link>
</Card>

       <Card className="border-red-800" >
  <Link href={'/Loadmanage/find-load-manage'}>
  <CardContent className='flex justify-center w-full'>

    
    <Image
      src="/find-load.jpg"                        
      alt="add-load"
      className='h-25 '
      width={100}
      height={25}
    />

  </CardContent>
  <CardHeader>
    <CardTitle className=' text-center text-red-800'>Find Load</CardTitle>
    <CardDescription>Load aviable for Your Truck </CardDescription>
   
  </CardHeader>
  </Link>
</Card>
 
       <Card className="border-red-800" >
  <Link href={'/Gps'}>
  <CardContent className='flex justify-center w-full'>

    
    <Image
      src="/img/Gps.png"                        
      alt="Gps"
      className='h-25 '
      width={100}
      height={25}
    />

  </CardContent>
  <CardHeader>
    <CardTitle className=' text-center text-red-800'>GPS</CardTitle>
    <CardDescription>Track Your Truck </CardDescription>
   
  </CardHeader>
  </Link>
</Card>
    </div>
    </section>
    </>
  )
}

export default ServicePage
