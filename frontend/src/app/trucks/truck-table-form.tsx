"use client"

import { useEffect, useState } from 'react'
import { Trucks } from './columns'

import * as ColumnsModule from "./columns";
import {  DataTables } from './data-table'


const TrucksTableForm = () => {
      const [data, setData] = useState<Trucks[]>([]);
     const fetchData = async () => {
        const token = localStorage.getItem("token");
       
        if (!token) return;
    const url=process.env.NEXT_PUBLIC_URL_BASE;
    
        const res = await fetch(`${url}api/trucks/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const result = await res.json();
        console.log(result.data);
        setData(result.data);
      };
    
      useEffect(() => {

        fetchData();
      }, []);
  
     const tableColumns = ColumnsModule.columns(fetchData);
  return (
    <>
   
            <DataTables columns={tableColumns} data={data} />

    

</>
  )
}

export default TrucksTableForm
