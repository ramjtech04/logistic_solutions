"use client";

import { useEffect, useState } from "react";
import {  Loads } from "./columns";

import { AppSidebar } from "@/components/ui/app-sidebar";
import * as ColumnsModule from "./columns";
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
import { DataTables } from "./data-table";

export default function CustomerListPage() {
  const [data, setData] = useState<Loads[]>([]);
 const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
const url=process.env.NEXT_PUBLIC_URL_BASE;

    const res = await fetch(`${url}api/admin/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    console.log(result)
    setData(result.requests);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
 const tableColumns = ColumnsModule.columns(fetchData);
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
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Loads</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Loads</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-white/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <DataTables columns={tableColumns} data={data} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
