"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Loads } from "../../columns";
import * as ColumnsModule from "../../columns";
import { DataTables } from "../../data-table";

export default function RequestDetailsPage() {
  const { status } = useParams(); // dynamic slug [lslug]
const [data, setData] = useState<Loads[]>([]);
 const fetchData = async () =>{ 
    const token = localStorage.getItem("token");
    if (!token) return;
const url=process.env.NEXT_PUBLIC_URL_BASE;

    const res = await fetch(`${url}api/admin/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    console.log(result.requests)
    let availableRequest;
    if(status =="all"){
 setData(result.requests || []);
    }else{
 availableRequest = (result.requests || []).filter(
      (truck: any) => truck.requestStatus?.toLowerCase() === status
    );
    setData(availableRequest);
    }
      

    
    console.log("data",availableRequest)
  };

  useEffect(() => {
    fetchData();
  }, []);
  

 const tableColumns = ColumnsModule.columns(fetchData);
//   const [data, setData] = useState<any[]>([]);
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* ---------- Header ---------- */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/70 backdrop-blur">
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
                  <BreadcrumbLink href="/admin/loads">Loads</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">Request {status}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* ---------- Page Content ---------- */}
         {status}
              <DataTables columns={tableColumns} data={data} />
      </SidebarInset>
    </SidebarProvider>
  );
}



