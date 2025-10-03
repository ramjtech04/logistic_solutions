"use client";

import dynamic from "next/dynamic";
import React from "react";

const TruckForm = dynamic(() => import("@/app/Components/truck-form"), {
  ssr: false,
  loading: () => (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  ),
});

interface MangeTruckPageProps {
  params: Promise<{ truckid: string; mode: string }>;
}

export default function MangeTruckPage({ params }: MangeTruckPageProps) {
  // ✅ Unwrap the params promise
  const { truckid, mode } = React.use(params);

  return <TruckForm id={truckid} mode={mode} />;
}
