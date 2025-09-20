"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaUserCircle   } from "react-icons/fa";
import { useRouter } from "next/navigation"

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

    localStorage.removeItem("role"); // role hatao
    setRole(null); // state update karo
    setisrole(false);
    console.log("Logged out, role removed!");
    router.push("/"); // Home page par redirect karo
  };

  return (
    <nav className=" bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-dark-600 size-12 flex">
           <img
          src="/trucklogo.png"
          alt="Image"
          className=""
        />
        Logistic Solution
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
          
         {  role == null && (<Button><Link href={"/account/register"}>Register</Link></Button> )}
          { role == null && ( <Button variant="outline"><Link href={"/account/login"}>Login</Link></Button>)}
          
          { role !== null && (
              <DropdownMenu>
  <DropdownMenuTrigger><FaUserCircle  size={24} /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem><Link href='/account/profile'>Profile</Link></DropdownMenuItem>
     {isrole && role && role == "truck_owner" && (   <DropdownMenuItem>Vechicles</DropdownMenuItem>)}
      {isrole && role && role == "truck_owner" && (   <DropdownMenuItem>Assign Loads</DropdownMenuItem>)}
            {isrole && role && role == "customer"&& (   <DropdownMenuItem>Assign Truck</DropdownMenuItem>)}
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
            {/* <Link href="/" className="hover:text-red-600 transition">
              Home
            </Link>
            <Link href="/" className="hover:text-red-600 transition">
              About
            </Link>
        
            <Link href="/" className="hover:text-red-600 transition">
              Contact
            </Link> */}
            <div className="flex  flex-col md:flex-row space-x-3 gap-y-2  pt-2">
              <Button variant="outline" className="w-full">
                Login
              </Button>
              <Button className="w-full">Sign Up</Button>
              <DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
