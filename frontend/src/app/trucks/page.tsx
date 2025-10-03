"use client"
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import('@/app/Components/Navbar'), { ssr: false });
const TrucksTableForm = dynamic(() => import('./truck-table-form'), { ssr: false, loading: () => <p>Loading form...</p> });
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";
const Truckspage = () => {
    
    
  return (
    <>
    <Navbar/>
    <div className='h-[200px] md:h-[300px] bg-red-800 text-white bg-center flex flex-col items-center justify-center' style={{backgroundImage:'url(/b1.jpg)'}} >
        <h1 className=' text-2xl sm:text-5xl font-bold mb-2'>Your Trucks</h1>
        <p className='text-sm text-center'>Organize and manage your Truck efficiently to keep operations running smoothly.</p>
 
    </div>
        
<div className='container mx-auto my-10 text-end'>
   <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild >
                <Link href='/'>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
       
        
        <BreadcrumbItem>
          <BreadcrumbPage>Trucks</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb> 

      <TrucksTableForm/>
</div>
    

</>
  )
}

export default Truckspage
