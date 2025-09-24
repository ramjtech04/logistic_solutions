
import Navbar from "@/app/Components/Navbar"
import TruckForm from "@/app/Components/truck-form"


export default async function MangeTruckPage(props: PageProps<'/trucks/[truckid]'>) {
  const { truckid } = await props.params

  return (
   <>
  
<Navbar/>
       <div className='h-[200px] md:h-[300px] bg-red-800 text-white bg-center flex flex-col items-center justify-center' style={{backgroundImage:'url(/b1.jpg)'}} >
           <h1 className=' text-2xl sm:text-5xl font-bold mb-2'>Your Trucks</h1>
           <p className='text-sm text-center'>Organize and manage your Truck efficiently to keep operations running smoothly.</p>
    
       </div>

   <div className='container mx-auto my-10 text-end'>

          {/* <TruckForm id={truckid}/> */}
      <TruckForm id={truckid}/>
            
   </div>    
   </>
  )
}