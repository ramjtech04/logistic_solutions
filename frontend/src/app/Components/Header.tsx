"use client";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";


export default function Header({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
const segments = pathname.split("/").filter(Boolean);

const moduleName = segments[0];
const pageName = segments[1];

  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { role } = auth;

  return (
    <>
      {role === "admin" && <>
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
                  <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/maintenance/list" className="capitalize" >{moduleName}</BreadcrumbLink>
                </BreadcrumbItem>
               <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize" >{pageName}</BreadcrumbPage>
                </BreadcrumbItem>
            
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-white/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
       

     {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
      </>}
      {role === "truck_owner" && 
      <>
      <Navbar/>

  <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-6">
         
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/maintenance/list" className="capitalize" >{moduleName}</BreadcrumbLink>
                </BreadcrumbItem>
               <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize" >{pageName}</BreadcrumbPage>
                </BreadcrumbItem>
            
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className=" px-6 py-4">
          {children}
        </div>
      </>
      }
     
    </>
  );
}