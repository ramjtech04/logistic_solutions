"use client"

import Link from "next/link"
import { useState, useEffect, useId, memo } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MdEmail } from "react-icons/md"
import { useRouter } from "next/navigation"
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

// Memoized Mobile Menu
const MobileMenu = memo(({ role, handleLogout, router }: any) => (
  <ul className="flex flex-col p-4 space-y-3">
    {role === null ? (
      <>
        <Button onClick={() => router.push("/account/register")} className="w-full">Register</Button>
        <Button variant="outline" onClick={() => router.push("/account/login")} className="w-full">Login</Button>
      </>
    ) : (
      <>
        <li className="p-2 cursor-pointer" onClick={() => router.push('/account/profile')}>Profile</li>
        {role === "truck_owner" && (
          <>
            <li className="p-2 cursor-pointer" onClick={() => router.push('/trucks')}>Trucks</li>
            <li className="p-2 cursor-pointer" onClick={() => router.push('/trucks/Assign-Request')}>Assign Delivery</li>
          </>
        )}
        {role === "customer" && (
          <li className="p-2 cursor-pointer" onClick={() => router.push('/Loadmanage/getloadRequest')}>Loads Request</li>
        )}
        <li className="p-2 cursor-pointer" onClick={handleLogout}>Logout</li>
      </>
    )}
  </ul>
))

// Memoized User Menu
const UserMenu = memo(({ role, handleLogout, router }: any) => {
  const triggerId = useId()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger id={triggerId}>
        <FaUserCircle size={24} />
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
      <div className="bg-red-800 text-white py-3 hidden md:block">
        <div className="flex justify-around items-center">
          <div><FaLocationDot className="inline mr-1" />H.NO. 10, SECTOR-9, FARIDABAD-121006, HARYANA</div>
          <p><FaPhoneAlt className="inline mr-1" />+91-9873245859, +91-9310068263</p>
          <p><MdEmail className="inline mr-1" />shreeradheylogistic2025@gmail.com</p>
        </div>
      </div>

      {/* Navbar */}
      <nav className="shadow-md sticky top-0 z-50 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/v1.jpg" alt="Logo" width={70} height={70} priority className="mr-2"/>
            <span className="hidden sm:block text-2xl font-bold text-dark-600">LOGISTIC</span>
            <span className="hidden sm:block text-2xl text-dark-600">SOLUTION</span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex space-x-4 items-center">
            {mounted && role ? (
              <UserMenu role={role} handleLogout={handleLogout} router={router} />
            ) : (
              <>
                <Button onClick={() => router.push("/account/register")}>Register</Button>
                <Button variant="outline" onClick={() => router.push("/account/login")}>Login</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu with smooth transition */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
          {mounted && <MobileMenu role={role} handleLogout={handleLogout} router={router} />}
        </div>
      </nav>
    </>
  )
}

export default Navbar
