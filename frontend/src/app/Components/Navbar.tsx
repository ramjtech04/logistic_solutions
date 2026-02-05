"use client"

import Link from "next/link"
import { useState, useEffect, useId, memo } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MdEmail } from "react-icons/md"
import { useRouter  } from "next/navigation"
import Image from "next/image"


import { FaPhoneAlt, FaUserCircle } from "react-icons/fa"
import { FaLocationDot } from "react-icons/fa6"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface MenuProps {
  role: string | null
  handleLogout: () => void
  router: ReturnType<typeof useRouter> 
}
// Memoized Mobile Menu
// const MobileMenu = memo(({ role, handleLogout, router }: MenuProps) => (
//   <ul className="flex flex-col p-4 space-y-3">
//     {role === null ? (
//       <>
      
//         <Button onClick={() => router.push("/account/register")} className="w-full">Register</Button>
//         <Button variant="outline" onClick={() => router.push("/account/login")} className="w-full">Login</Button>
        
         
//       </>
//     ) : (
//       <>
//         <li className="p-2 cursor-pointer hover:text-red-800 font-bold" onClick={() => router.push('/account/profile')}>Profile</li>
//         {role === "truck_owner" && (
//           <>
//             <li className="p-2 cursor-pointer hover:text-red-800 font-bold" onClick={() => router.push('/trucks')}>Trucks</li>
//             <li className="p-2 cursor-pointer hover:text-red-800 font-bold" onClick={() => router.push('/trucks/Assign-Request')}>Assign Delivery</li>
//           </>
//         )}
//         {role === "customer" && (
//           <li className="p-2 cursor-pointer hover:text-red-800 font-bold" onClick={() => router.push('/Loadmanage/getloadRequest')}>Loads Request</li>
//         )}
//         <li className="p-2 cursor-pointer hover:text-red-800 font-bold" onClick={handleLogout}>Logout</li>
//       </>
//     )}
//   </ul>
// ))

// MobileMenu.displayName = "MobileMenu"

// Memoized User Menu
const UserMenu = memo(({ role, handleLogout, router }: MenuProps) => {
  const triggerId = useId()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger id={triggerId}>
        <div className="flex flex-col md:flex-row items-center justify-center capitalize font-bold text-md"><FaUserCircle size={24} /> <span className="hidden md:block">{role} </span></div>  
        </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/account/profile')}>Profile</DropdownMenuItem>
        {role === "truck_owner" && (
          <>
            <DropdownMenuItem onClick={() => router.push('/trucks')}>Trucks</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/trucks/Assign-Request')}>Assign Delivery</DropdownMenuItem>
          </>
        )}
        {role === "customer" && (
          <DropdownMenuItem onClick={() => router.push('/Loadmanage/getloadRequest')}>Loads Request</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
UserMenu.displayName = "UserMenu"

const Navbar = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setRole(localStorage.getItem("role"))
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    setRole(null)
    router.push("/")
  }

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-red-800 block md:hidden text-white py-3  ">
        <div className="flex  flex-wrap justify-around items-center gap-2">
          <div className="text-xs md:text-base"><FaLocationDot className="inline mr-1" />H.NO. 10, SECTOR-9, FARIDABAD-121006, HARYANA</div>
          <a href="tel:+919873245859" className="text-xs md:text-base"><FaPhoneAlt className="inline mr-1 " />+91-9873245859, +91-9310068263</a>
          <a href="mailto:shreeradheylogistic2025@gmail.com" className="text-xs md:text-base"> <MdEmail className="inline mr-1" />shreeradheylogistic2025@gmail.com</a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="shadow-md sticky top-0 z-50 bg-white md:bg-red-800 texy-black md:text-white">
        <div className="container-fluid mx-auto flex   items-center md:items-end justify-between ">
          {/* Logo */}
          <div className="md:w-[400px] md:flex justify-center items-center">
          <Link href="/" className="flex items-center ">
            <Image src="/img/t_logo.png" alt="Logo" width={130} height={130}  className="mr-2 w-full h-full hidden md:block " />
                    <Image src="/img/color_logo.jpg" alt="Logo" width={100} height={100}  className="mx-2 w-full h-full  md:hidden block " />
            {/* <span className=" text-xl md:text-2xl font-bold text-dark-600">LOGISTIC</span>
            <span className="text-xl md:text-2xl text-dark-600">SOLUTION</span> */}
          </Link>
          </div>
          <div className="flex flex-col flex-1 ">
            <div className="container ">
                <div className="bg-red-800 hidden md:block text-white py-3  ">
        <div className=" flex  flex-wrap justify-end items-center gap-2  mr-3">
          <div className="text-xs md:text-md w-full text-end"><FaLocationDot className="inline mr-1" />H.NO. 10, SECTOR-9, FARIDABAD-121006, HARYANA</div>
          <a href="tel:+919873245859" className="text-xs md:text-md"><FaPhoneAlt className="inline mr-1 " />+91-9873245859, +91-9310068263</a>
          <a href="mailto:shreeradheylogistic2025@gmail.com" className="text-xs md:text-md"> <MdEmail className="inline mr-1" />shreeradheylogistic2025@gmail.com</a>
        </div>
      </div>

       <div className="hidden md:flex space-x-4 items-center  ">
        <ul className="flex w-full flex-wrap justify-around items-center gap-2 py-2 pr-3 bg-white text-black rounded-tl-[30px]" >
          <li><Link href="/" className="hover:text-red-800 font-bold">Home</Link></li>
          <li><Link href="/#about" className="hover:text-red-800 font-bold">About</Link></li>
          <li><Link href="/#services" className="hover:text-red-800 font-bold">Services</Link></li>
          <li><Link href="/#contact" className="hover:text-red-800 font-bold ">Contact</Link></li>
          <li>   {mounted && role ? (
              <UserMenu role={role} handleLogout={handleLogout} router={router} />
            ) : (
              <>
                {/* <Button onClick={() => router.push("/account/register")}>Register</Button> */}
                <button className="bg-red-800 py-[10px] px-[20px] rounded-[4px] text-white hover:bg-red-900"  onClick={() => router.push("/account/login")}>Login</button>
              </>
            )}</li>
        </ul>
         
          </div>
          </div>
          </div>
         
          {/* Desktop Actions */}
         

          {/* Mobile Menu Button */}
          <div className="md:hidden block">
          {mounted && role ? (
              <UserMenu role={role} handleLogout={handleLogout} router={router} />
            ) : (
              <>
                {/* <Button onClick={() => router.push("/account/register")}>Register</Button> */}
                <Button  className="bg-red-800 text-white hover:bg-red-900" onClick={() => router.push("/account/login")}>Login</Button>
              </>
            )}
            </div>
       
          <button onClick={toggleMenu} className="md:hidden focus:outline-none mx-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu with smooth transition */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
           <ul className="flex flex-col w-full h-full flex-wrap justify-around items-center gap-2 py-2 pr-3 bg-white text-black rounded-tl-[30px]" >
          <li><Link href="/" className="hover:text-red-800 font-bold">Home</Link></li>
          <li><Link href="/#about" className="hover:text-red-800 font-bold">About</Link></li>
          <li><Link href="/#services" className="hover:text-red-800 font-bold">Services</Link></li>
          <li><Link href="/#contact" className="hover:text-red-800 font-bold ">Contact</Link></li>  
           {/* {mounted && <MobileMenu role={role} handleLogout={handleLogout} router={router} />}       */}
        </ul>
        
        </div>
      </nav>
    </>
  )
}

export default Navbar
