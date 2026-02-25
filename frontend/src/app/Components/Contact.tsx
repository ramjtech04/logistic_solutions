"use client"
import React, { useState, ChangeEvent } from "react"

import Link from "next/link"
import { FaLocationArrow, FaMailBulk, FaPhone } from "react-icons/fa"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {  X } from "lucide-react"

interface ContactForm {
  name: string
  email: string
  phone:string
  message: string
}

const Contact: React.FC = () => {
     const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone:"",
    message: "",
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 
  e.preventDefault()
  setStatusMessage(null)
  setStatusType(null)
  setIsLoading(true) 
  try {
     const url=process.env.NEXT_PUBLIC_URL_BASE;
    const res = await fetch(`${url}api/auth/enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
        setStatusMessage("❌ Failed to send enquiry.")
      setStatusType("error")
      throw new Error(data.message || "Email failed")
    }

   setStatusMessage("📧 Enquiry sent successfully!")
      setStatusType("success")
      setFormData({ name: "", email: "", phone:"", message: "" })
  } catch (error) {
    setStatusMessage("An error occurred while sending the enquiry.")
      setStatusType("error")
      console.error("Error sending enquiry:", error)
  }finally {
    setIsLoading(false) // stop loading
  }
}

  return (
    <section
      id="contact"
      className="bg-red-800 text-white py-16 md:py-24 px-6"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT SIDE – IMAGE + TEXT */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Get in Touch With Us
          </h2>

          <p className="text-gray-200">
            Have questions about our logistics services?  
            Send us an enquiry and our team will get back to you quickly.
          </p>

          <div className='flex  flex-col  gap-5 text-white '>
          <h1 className='text-2xl font-bold mb-4'>Contact Us</h1>
          <Link href='#' className='flex justify-start items-center gap-2 font-[600]  text-md'>
         <FaLocationArrow color='#fff' size={20}  />   H.NO. 10,  SECTOR-9, FARIDABAD-121006, HARYANA
          </Link>
          <Link href='#' className=' flex justify-start items-center gap-2 font-[600] text-md'>
           <FaPhone size={20}  color='#fff'/>   +91-9873245859, +91-9310068263
          </Link>
          <Link href='#' className=' flex justify-start items-center gap-2 font-[600]  text-md'>
         <FaMailBulk color='#fff' size={20} /> shreeradheylogistic2025@gmail.com / srl@shreeradheylogistic.com</Link>
         
        </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Enquiry Form
          </h3>
          {statusMessage && (
  <Alert
    className={`mb-4 relative ${
      statusType === "success"
        ? "border-green-500 bg-green-50 text-green-800"
        : "border-red-500 bg-red-50 text-red-800"
    }`}
  >
    <AlertTitle className="font-semibold">
      {statusType === "success" ? "Success" : "Error"}
    </AlertTitle>

    <AlertDescription>{statusMessage}</AlertDescription>

    {/* Close Button */}
    <button
      onClick={() => {
        setStatusMessage(null)
        setStatusType(null)
      }}
      className="absolute top-3 right-3 text-gray-600 hover:text-black"
    >
      <X size={18} />
    </button>
  </Alert>
)}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded text-black focus:outline-none focus:border-red-600"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded text-black focus:outline-none focus:border-red-600"
              required
            />

             <input
              type="text"
              name="phone"
              placeholder="Your Phone Number    "
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded text-black focus:outline-none focus:border-red-600"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 p-3 text-black rounded focus:outline-none focus:border-red-600"
              required
            />

            <button
  type="submit"
  className={`w-full bg-red-800 text-white py-3 rounded font-medium hover:bg-red-900 transition flex justify-center items-center gap-2`}
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      Sending...
    </>
  ) : (
    "Send Enquiry"
  )}
</button>

          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
