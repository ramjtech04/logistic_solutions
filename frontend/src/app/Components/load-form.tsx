"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-label"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Customer {
  _id: string
  name: string
  email: string
  phone: string
}

export default function LoadRequestForm() {
  const [pickupAddress, setPickupAddress] = useState("")
  const [pickupCity, setPickupCity] = useState("")
  const [pickupState, setPickupState] = useState("")
  const [dropAddress, setDropAddress] = useState("")
  const [dropCity, setDropCity] = useState("")
  const [dropState, setDropState] = useState("")
  const [loadType, setLoadType] = useState("")
  const [loadWeight, setLoadWeight] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState("")

  const [role, setRole] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const url = process.env.NEXT_PUBLIC_URL_BASE

  // Get role and userId from localStorage (client-side)
  useEffect(() => {
    setRole(localStorage.getItem("role"))
    setUserId(localStorage.getItem("userId"))
  }, [])

  // Fetch customers only if admin
  useEffect(() => {
    const fetchCustomers = async () => {
      if (role !== "admin") return
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch(`${url}api/users/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      console.log(data)
      setCustomers(data.data)
    }

    fetchCustomers()
  }, [role, url])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const customerIdToUse = role === "admin" ? selectedCustomer : userId
console.log("Submitting for customer ID:", customerIdToUse);
    console.log("slected",selectedCustomer, userId);
    if (!customerIdToUse) {
      Swal.fire("Error", "Customer ID not found", "error")
      return
    }

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Submitting your request",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      })

      const res = await fetch(url + "api/requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          customerId: customerIdToUse,
          pickupState,
          pickupCity,
          pickupAddress,
          dropState,
          dropCity,
          dropAddress,
          loadType,
          loadWeight,
        }),
      })

      const data = await res.json()
      if (data.success) {
        await Swal.fire({
          title: "Success",
          text: data.message,
          icon: "success",
        })
        // Reset form
        setPickupAddress("")
        setPickupCity("")
        setPickupState("")
        setDropAddress("")
        setDropCity("")
        setDropState("")
        setLoadType("")
        setLoadWeight("")
        if (role === "admin") setSelectedCustomer("")
      } else {
        Swal.fire("Error", data.message, "error")
      }
    } catch (err) {
      console.log(err)
      Swal.fire("Error", "Something went wrong", "error")
    } finally {
      Swal.close()
    }
  }

  return (
    <div>
      <Card className="max-w-3xl mx-auto mt-10 border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add Load</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4">
            
            {/* Admin-only Customer Select */}
            {role === "admin" && (
              <div>
                <Label>Customer</Label>
                <Select
                  value={selectedCustomer}
                  onValueChange={(val) => setSelectedCustomer(val)}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name} ({c.email}/{c.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pickup Address */}
            <div>
              <Label>Pickup Address</Label>
              <Textarea
                name="pickupAddress"
                placeholder="Full pickup address"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label>Pickup City</Label>
                <Input
                  name="pickupCity"
                  placeholder="e.g. Delhi"
                  required
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                />
              </div>
              <div>
                <Label>Pickup State</Label>
                <Input
                  name="pickupState"
                  placeholder="e.g. Madhya Pradesh"
                  required
                  value={pickupState}
                  onChange={(e) => setPickupState(e.target.value)}
                />
              </div>
            </div>

            {/* Drop Address */}
            <div>
              <Label>Drop Address</Label>
              <Textarea
                name="dropAddress"
                placeholder="Full drop address"
                required
                value={dropAddress}
                onChange={(e) => setDropAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label>Drop City</Label>
                <Input
                  name="dropCity"
                  placeholder="e.g. Mumbai"
                  required
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
                />
              </div>
              <div>
                <Label>Drop State</Label>
                <Input
                  name="dropState"
                  placeholder="e.g. Maharashtra"
                  required
                  value={dropState}
                  onChange={(e) => setDropState(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label>Load Type</Label>
                <Input
                  name="loadType"
                  placeholder="e.g. FMCG, Cement"
                  required
                  value={loadType}
                  onChange={(e) => setLoadType(e.target.value)}
                />
              </div>

              <div>
                <Label>Weight (in Tons)</Label>
                <Input
                  name="loadWeight"
                  type="number"
                  placeholder="e.g. 10"
                  required
                  value={loadWeight}
                  onChange={(e) => setLoadWeight(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit Load
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
