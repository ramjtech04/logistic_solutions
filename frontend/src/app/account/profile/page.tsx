"use client"
import dynamic from "next/dynamic";
// dynamic import
const Navbar = dynamic(() => import('@/app/Components/Navbar'), { ssr: false });
const Profilepage = dynamic(() => import('@/app/Components/profile-form'), { ssr: false, loading: () => <p>Loading form...</p> });
const page = () => {
  return (
   <>
   <Navbar/>  
   <div className='md:bg-sky-600 md:h-screen md:flex md:items-center md:justify-center'>
        <Profilepage/>
   </div>

   </>
  )
}

export default page