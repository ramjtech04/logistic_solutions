"use client";

import { useEffect, useState } from "react";
import {  Loads } from "./columns";
// import { DataTable } from "@/components/ui/data-tables";
import * as ColumnsModule from "./columns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Navbar from "@/app/Components/Navbar";
import { DataTables } from "@/app/admin/loads/data-table";


export default function GetLoadRequestPage() {
  const [data, setData] = useState<Loads[]>([]);
 const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
const url=process.env.NEXT_PUBLIC_URL_BASE;

    const res = await fetch(`${url}api/requests/my-requests`, {
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
    <>
 <Navbar />
 <div className="container mx-auto my-5">
         <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Load Request</BreadcrumbPage>
                </BreadcrumbItem>
            
              </BreadcrumbList>
            </Breadcrumb>
      
            <DataTables columns={tableColumns} data={data} />
            </div>
          </>
  );
}
