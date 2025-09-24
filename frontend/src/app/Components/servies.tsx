import React from 'react'
import {
  Card,CardAction,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'



const ServicePage = () => {
  
  return (
    <>
    <section className="bg-sky-50 p-2">
    <div className="container mx-auto text-center grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
<Card className="">
  <Link href={'/Loadmanage/add-load-manage'}>
 
  <CardContent className='flex justify-center w-full'>

    <Image
      src="/add-load.png"                        
      alt="add-load"
      className='h-25 '
      width={100}
      height={25}
    />

  </CardContent>
  <CardHeader>
    <CardTitle className='text-center'>Add Load</CardTitle>
    <CardDescription>Adding a load Detail connect with available trucks. </CardDescription>
  </CardHeader>
   </Link>
</Card>

       <Card className="" >
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
    <CardTitle className='text-center'>Find Load</CardTitle>
    <CardDescription>Load aviable for Your Truck </CardDescription>
   
  </CardHeader>
  </Link>
</Card>
 
    </div>
    </section>
    </>
  )
}

export default ServicePage
