
import TruckForm from "@/app/Components/truck-form"

export default async function MangeTruckPage(props: PageProps<'/trucks/[mode]/[truckid]'>) {
  const { truckid } = await props.params
  const {mode} =await props.params
  
  return (
   <>
          {/* <TruckForm id={truckid}/> */}
      <TruckForm id={truckid} mode={mode} />
            
      
   </>
  )
}