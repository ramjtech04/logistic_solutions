import Navbar from '@/app/Components/Navbar'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
const AddLoadManagepage = () => {
  return (
    <>
      <Navbar />
      <Card className="max-w-2xl mx-auto mt-10 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add Load</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div>
              <Label>Load Type</Label>
              <Input name="loadType" placeholder="e.g. FMCG, Cement" required />
            </div>

            <div>
              <Label>Weight (in Tons)</Label>
              <Input name="weight" type="number" placeholder="e.g. 10" required />
            </div>

            <div>
              <Label>Pickup Address</Label>
              <Textarea name="pickupAddress" placeholder="Full pickup address" required />
            </div>

            <div>
              <Label>Pickup City</Label>
              <Input name="pickupCity" placeholder="e.g. Delhi" required />
            </div>

            <div>
              <Label>Drop Address</Label>
              <Textarea name="dropAddress" placeholder="Full drop address" required />
            </div>

            <div>
              <Label>Drop City</Label>
              <Input name="dropCity" placeholder="e.g. Mumbai" required />
            </div>

            <div>
              <Label>Truck Body Type</Label>
              <Select >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dala">Truck (Dala)</SelectItem>
                  <SelectItem value="container">Truck (Container)</SelectItem>
                  <SelectItem value="Truck flat Bed">Truck (Flat Bed)</SelectItem>
                  <SelectItem value="Trailor Dala Body">Trailor(Dala Body)</SelectItem>
                  <SelectItem value="Trailor Flat Bed">Trailor(Flat Bed)</SelectItem>
                  <SelectItem value="Tipper">Tipper</SelectItem>
                  <SelectItem value="Dumper">Dumper</SelectItem>
                  <SelectItem value="tipper">Tipper</SelectItem>
                  <SelectItem value="hyva">Hvya</SelectItem>
                  <SelectItem value="Trip Trailor">Trip Trailor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Capacity</Label>
              <Input name="truckSize" placeholder="e.g.40 MT,55 MT" />
            </div>

            <div>
              <Label>Truck Size</Label>
              <Input name="truckSize" placeholder="e.g. 20ft, 32ft" />
            </div>

            <div>
              <Label>Pickup Date</Label>
              <Input name="pickupDate" type="date" required />
            </div>

            <div>
              <Label>Contact Number</Label>
              <Input name="contact" placeholder="Enter contact" required />
            </div>

            <div>
              <Label>Additional Notes</Label>
              <Textarea name="notes" placeholder="Special instructions (optional)" />
            </div>

            <Button type="submit" className="w-full">Submit Load</Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AddLoadManagepage