"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaPhoneAlt, FaUserCircle   } from "react-icons/fa";
import { useRouter } from "next/navigation"
import Image from "next/image"

const Navbar = () => {
        const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null);
  const[isrole,setisrole]=useState(false);
  const toggleMenu = () => setIsOpen(!isOpen)
  
  useEffect(() => {
    // Runs only in browser
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    setisrole(true);
    console.log("Role from localStorage:", storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // role hatao
    setRole(null); // state update karo
    setisrole(false);
    console.log("Logged out, role removed!");
    router.push("/"); // Home page par redirect karo
  };

  return (
    <>
 
     <div className="bg-red-800 text-white py-3 hidden md:block">
       <div className="flex justify-around items-center ">
        <div ><FaLocationDot className="inline" />H.NO. 10, SECTOR-9, FARIDABAD-121006, HARYANA </div>
        <p><FaPhoneAlt className="inline" />  +91-9873245859, +91-9310068263 </p>
          <p><MdEmail  className="inline"  />shreeradheylogistic2025@gmail.com </p>
         
       </div>
     </div>
    
    <nav className=" shadow-md sticky top-0 z-50 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <Link href="/" className=" flex items-center ">
        <Image
  src="/v1.jpg"
  alt="Logo"
  width={70}
  height={70}
  sizes="(max-width: 640px) 50px, (max-width: 768px) 70px, 80px"
  className="mr-2"
/>
       <span className="hidden sm:block text-2xl font-bold text-dark-600 ">LOGISTIC</span><span className="hidden sm:block text-2xl  text-dark-600">SOLUTION</span>
       
        </Link>

        {/* Desktop Menu */}
        {/* <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-red-600 transition">
            Home
          </Link>
          <Link href="/" className="hover:text-red-600 transition">
            About
          </Link>
         
          <Link href="/" className="hover:text-red-600 transition">
            Contact
          </Link>
        </div> */}

        {/* Actions */}
        <div className="hidden md:flex space-x-4">
          
         {  role == null && (<Button onClick={()=>{router.push("/account/register")} } className="cursor-pointer">Register</Button> )}
          { role == null && ( <Button variant="outline" onClick={()=>{router.push("/account/login")}} className="cursor-pointer">Login</Button>)}
          
          { role !== null && (
              <DropdownMenu>
  <DropdownMenuTrigger><FaUserCircle  size={24} /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={()=>{router.push('/account/profile')}}>Profile</DropdownMenuItem>
     {isrole && role && role == "truck_owner" && ( <><DropdownMenuItem onClick={()=>{router.push('/trucks')}}>Trucks</DropdownMenuItem><DropdownMenuItem onClick={()=>{router.push('/trucks/Assign-Request')}}>Assign Delivery</DropdownMenuItem></>  )}

                 {isrole && role && role == "customer"&& (<DropdownMenuItem onClick={()=>{router.push('/Loadmanage/getloadRequest')}}>Loads Request</DropdownMenuItem>)}
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
  </DropdownMenuContent>

</DropdownMenu>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col p-4 space-y-3">
           
            <div className="flex  flex-col md:flex-row space-x-3 gap-y-2 h-full pt-2">
             <div className=" md:hidden space-x-4">
          
         {  role == null && (<Button onClick={()=>{router.push("/account/register")} } className="cursor-pointer w-full text-center mb-2">Register</Button> )}
          { role == null && ( <Button variant="outline" onClick={()=>{router.push("/account/login")}} className="cursor-pointer w-full text-center mb-2">Login</Button>)}
          
          { role !== null && (
       <ul className=" p-2 ">
  <li className="p-2 cursor-pointer" onClick={() => router.push('/account/profile')}>Profile</li>
  
  {isrole && role === "truck_owner" && (
    <>
      <li className="p-2 cursor-pointer" onClick={() => router.push('/trucks')}>Trucks</li>
            <li className="p-2 cursor-pointer" onClick={() => router.push('/trucks/Assign-Request')}>Assign Delivery</li>

    </>
  )}

  {isrole && role === "customer" && (
    <>

      <li className="p-2 cursor-pointer" onClick={() => router.push('/Loadmanage/getloadRequest')}>Loads Request</li>
    </>
  )}

  <li className="p-2 cursor-pointer" onClick={handleLogout}>Logout</li>
</ul>

          )}

        </div>
             
            </div>
          </div>
        </div>
      )}
    </nav>
   
    </>
  )
}

export default Navbar
