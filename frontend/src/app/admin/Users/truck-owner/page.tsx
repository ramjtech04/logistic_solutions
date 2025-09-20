"use client";

import { useEffect, useState } from "react";
import {  User } from "./columns";
import { DataTable } from "@/components/ui/data-tables";
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

export default function TruckOwnerListPage() {
  const [data, setData] = useState<User[]>([]);
 const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
const url=process.env.NEXT_PUBLIC_URL_BASE;

    const res = await fetch(`${url}api/users/truck-owners`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    setData(result.data);
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
                  <BreadcrumbPage>Users</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Truck Owners</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-white/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <DataTable columns={tableColumns} data={data} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
