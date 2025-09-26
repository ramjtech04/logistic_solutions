"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Boxes,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  
  TruckElectric,
  
  Users2,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavProjects } from "@/components/ui/nav-projects"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/Sample_User_Icon.png",
    
  },
  navMain: [
    {
      title: "Users",
      url: "#",
      icon: Users2,
      isActive: true,
      items: [
           
        {
          title: "Add User",
          url: "/admin/Users/add-user",
        },
        {
          title: "Customer",
          url: "/admin/Users/customer",
        },
        {
          title: "Trucks Owner",
          url: "/admin/Users/truck-owner",
        }
       
      ],
    },
    {
      title: "Trucks",
      url: "#",
      icon: TruckElectric,
      items: [
         {
          title: "Add Trucks",
          url: "/trucks/add",
        },
        {
          title: "List Trucks",
          url: "/admin/truck",
        },
       
      ],
    },
    {
      title: "Manage Loads",
      url: "#",
      icon: Boxes,
      items: [
      
        {
          title: "All Loads",
          url: "/admin/loads",
        },
        {
          title: "Manage Requests",
          url: "/admin/loads/loadrequest",
        }
       
      ],
    },
   
  ],
  navSecondary: [
 
  ],
  projects: [
  
 
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Logistic Solution</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
