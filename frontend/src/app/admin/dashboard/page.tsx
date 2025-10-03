"use client"
import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaBoxes, FaTruck } from "react-icons/fa"
import { MdGroups2 } from "react-icons/md"

const dashboardItems = [
  { label: "Customers", icon: MdGroups2, color: "bg-sky-500/50", route: "/admin/Users/customer" },
  { label: "Truck Owners", icon: MdGroups2, color: "bg-purple-500/50", route: "/admin/Users/truck-owner" },
  { label: "Trucks", icon: FaTruck, color: "bg-green-500/50", route: "/admin/truck" },
  { label: "Loads", icon: FaBoxes, color: "bg-red-500/50", route: "/admin/loads/loadrequest/all" }, 
]

export default function Page() {
  const router = useRouter()

  const renderCard = (item: typeof dashboardItems[0], index: number) => {
    const Icon = item.icon
    return (
      <div
        key={index}
        className={`${item.color} aspect-video rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform`}
        onClick={() => item.route && router.push(item.route)}
      >
        <Icon size={100} className="text-white mb-2" />
        <span className="text-xl font-medium text-white">{item.label}</span>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-6 my-8 shrink-0 items-center px-4 gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashobard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-3 auto-rows-min">
            {dashboardItems.map(renderCard)}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
