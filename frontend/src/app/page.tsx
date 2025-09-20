import Image from "next/image";
import Navbar from "./Components/Navbar";
import HeroBanner from "./Components/hero";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <>
    <Navbar/>
   <HeroBanner />
  
    </>
  );
}
