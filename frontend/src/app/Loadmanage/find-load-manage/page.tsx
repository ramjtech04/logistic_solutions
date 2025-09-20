"use client";

import Navbar from "@/app/Components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, ChangeEvent, FormEvent } from "react";


interface FormData {
  name: string;
  contact: string;
  email: string;
  source: string;
  destination: string;
  loadType: string;
  bodyType: string;
  capacity: string;
  truckSize: string;
  notes: string;
}

const TruckForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contact: "",
    email: "",
    source: "",
    destination: "",
    loadType: "",
    bodyType: "",
    capacity: "",
    truckSize: "",
    notes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    alert("Truck request submitted!");
  };

  return (
    <>
    <Navbar />
    <div className="max-w-3xl mx-auto p-8   rounded-xl ">
      <h2 className="text-2xl font-semibold text-center mb-6">Truck Needed Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

       
        {/* Source & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="source">Source Location</Label>
            <Input
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Enter source"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="destination">Destination Location</Label>
            <Input
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination"
              required
            />
          </div>
        </div>

        {/* Load Type */}
        <div className="flex flex-col">
          <Label htmlFor="loadType">Load / Cargo Type</Label>
          <Input
            id="loadType"
            name="loadType"
            value={formData.loadType}
            onChange={handleChange}
            placeholder="Type of cargo"
            required
          />
        </div>

        {/* Body Type */}
        <div className="flex flex-col">
          <Label htmlFor="bodyType">Body Type</Label>
          <Select
            onValueChange={(value) => handleSelectChange(value, "bodyType")}

          >
            <SelectTrigger  className="w-full">
              <SelectValue placeholder="Select Body Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed / Box</SelectItem>
              <SelectItem value="container">Container</SelectItem>
              <SelectItem value="tanker">Tanker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Capacity */}
        <div className="flex flex-col">
          <Label htmlFor="capacity">Capacity (Tons)</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Enter capacity"
            required
          />
        </div>

        {/* Truck Size */}
        <div className="flex flex-col">
          <Label htmlFor="truckSize">Truck Size / Dimensions</Label>
          <Input
            id="truckSize"
            name="truckSize"
            value={formData.truckSize}
            onChange={handleChange}
            placeholder="Enter truck size or dimensions"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional info"
            rows={4}
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full mt-2">
          Submit Request
        </Button>
      </form>
    </div>
    </>
  );
};

export default TruckForm;
