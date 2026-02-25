"use client";

import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";



const Map = dynamic(() => import("@/app/Components/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Gps() {
  return (
    <>
<div className="bg-red-800 text-white py-2 sticky top-0 z-50">
    <Link href="/" className="text-white px-4 py-2 rounded  flex items-center"><ArrowLeft/><span className="ml-2 sm:hidden md:block">Back</span></Link>
</div>
  <Map  />
  </>
  )
}
