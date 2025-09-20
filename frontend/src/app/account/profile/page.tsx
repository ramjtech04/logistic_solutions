import Navbar from '@/app/Components/Navbar'
import Profilepage from '@/app/Components/profile-form'
import React from 'react'

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