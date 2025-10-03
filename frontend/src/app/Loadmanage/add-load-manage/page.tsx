"use client"
// import Navbar from '@/app/Components/Navbar'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

// import LoadRequestForm from '@/app/Components/load-form'
import dynamic from "next/dynamic";
import Link from 'next/link';

// dynamic import
const Navbar = dynamic(() => import('@/app/Components/Navbar'), { ssr: false });
const LoadRequestForm = dynamic(() => import('@/app/Components/load-form'), { ssr: false, loading: () => <p>Loading form...</p> });

const AddLoadManagepage = () => {
  return (
    <>
      <Navbar />
       <div className='h-[200px] md:h-[300px] bg-red-800 text-white bg-center flex flex-col items-center justify-center' style={{backgroundImage:'url(/b1.jpg)'}} >
           <h1 className=' text-2xl sm:text-5xl font-bold mb-2'>Loads</h1>
           <p className='text-sm text-center'>Request  Loads .</p>
    
       </div>

      <div className="container mx-auto mt-10">
       <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink  asChild>
        <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
       
        
        <BreadcrumbItem>
          <BreadcrumbPage>Add Load</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb> 
    </div>
   <LoadRequestForm/>
    </>
  )
}

export default AddLoadManagepage