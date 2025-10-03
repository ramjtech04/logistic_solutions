"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"

// Lazy load components that break SSR
const AppSidebar = dynamic(() => import("@/components/ui/app-sidebar").then(mod => mod.AppSidebar), { ssr: false })
const UserUpdated = dynamic(() => import("./UserUpdated").then(mod => mod.default), { ssr: false })

export default function TruckOwnerPageList() {
  const params = useParams<{ mode: string; id: string }>()
  const mode = params?.mode
  const id = params?.id

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
                  <BreadcrumbLink asChild>
                    <Link href='/admin/dashboard'>Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Breadcrumb>Users</Breadcrumb>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{mode} User</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-white/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <UserUpdated mode={mode} id={id} /> 
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
