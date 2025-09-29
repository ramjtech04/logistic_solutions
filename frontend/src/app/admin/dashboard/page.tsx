"use client"
import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { FaBoxes ,FaTruck} from "react-icons/fa"
import { MdGroups2 } from "react-icons/md";

export default function Page() {
  const router =useRouter();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">
                 Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
               
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-sky-500/50 aspect-video rounded-xl  flex flex-col justify-center items-center" onClick={()=>router.push('/admin/Users/customer')}  >
            <div className="d-flex justify-center items-center  font-medium text-white" ><MdGroups2 size={100} /> </div>
            <div className="d-flex justify-center items-center text-xl font-medium text-white">Customers </div>
            </div>

              <div className="bg-purple-500/50 aspect-video rounded-xl  flex flex-col justify-center items-center" onClick={()=>router.push('/admin/Users/truck-owner')}  >
            <div className="d-flex justify-center items-center text-2xl font-medium text-white" ><MdGroups2 size={100} /></div>
            <div className="d-flex justify-center items-center text-xl font-medium text-white">Truck Owners</div>
            </div>
             <div className="bg-green-500/50 aspect-video rounded-xl  flex flex-col justify-center items-center" onClick={()=>router.push('/admin/truck')} >
            <div className="d-flex justify-center items-center text-2xl font-medium text-white"><FaTruck size={100} /></div>
            <div className="d-flex justify-center items-center text-xl font-medium text-white">Trucks </div>
            </div>
           <div className="bg-red-500/50 aspect-video rounded-xl  flex flex-col justify-center items-center" >
            <div className="d-flex justify-center items-center text-2xl font-medium text-white"><FaBoxes size={100} /></div>
            <div className="d-flex justify-center items-center text-xl font-medium text-white">Loads</div>
            </div>
          </div>
          {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
     
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
