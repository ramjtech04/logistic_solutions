import Image from "next/image";
import Navbar from "./Components/Navbar";
import HeroBanner from "./Components/hero";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServicePage from "./Components/servies";


export default function Home() {
  return (
    <>
    <Navbar/>
   <HeroBanner />
   <ServicePage/>
  
    </>
  );
}
