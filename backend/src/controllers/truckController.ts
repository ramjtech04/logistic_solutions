//Add truck
//get all truck irrespective of truck owner
//get specific truck by id
//update truck 
//delete truck
//get trucks of specific owner
import { Request, Response } from "express";
import mongoose from "mongoose";
import Truck from "../models/truckModel";
import logger from "../utils/logger";
// ADD TRUCK
export const addTruck = async (req: Request, res: Response) => {
  try {
    const { truckNumber, truckType, capacity, state, city, fuelType, truckOwnerId } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    let ownerIdToUse: string;
    if (req.user.role === "admin") {
      if (!truckOwnerId) {
        return res.status(400).json({ success: false, message: "truckOwnerId is required for admin", data: null });
      }
      ownerIdToUse = truckOwnerId;
    } else {
      ownerIdToUse = req.user.id;
    }

    // Check if truckNumber already exists
    const existingTruck = await Truck.findOne({ truckNumber });
    if (existingTruck) {
      return res.status(400).json({ success: false, message: "Truck number already exists", data: null });
    }

    const truck = await Truck.create({
      truckNumber,
      truckType,
      capacity,
      state,
      city,
      fuelType,
      truckOwnerId: ownerIdToUse,
    });

    res.status(201).json({ success: true, message: "Truck added successfully", data: truck });
  } catch (error: any) {
    logger.error("Error in addTruck ",error)
    res.status(500).json({ success: false, message: error.message || "Server error", data: null });
  }
};

// GET ALL TRUCKS
export const getTrucks = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    const { truckOwnerId, status, state, city } = req.query;
    const filters: any = {};

    // Truck owner can only see their own trucks
    if (req.user.role === "truck_owner") {
      filters.truckOwnerId = req.user.id;
    } else if (truckOwnerId) {
      filters.truckOwnerId = new mongoose.Types.ObjectId(truckOwnerId as string);
    }

    if (status) filters.status = status;
    if (state) filters.state = state;
    if (city) filters.city = city;

    const trucks = await Truck.find(filters);
    res.status(200).json({ success: true, message: "Trucks fetched successfully", data: trucks });
  } catch (error: any) {
     logger.error("Error getTrucks Controller ",error);
    res.status(500).json({ success: false, message: error.message || "Server error", data: null });
  }
};

// GET TRUCK BY ID
export const getTruckById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ success: false, message: "Truck not found", data: null });
    }

    // Truck owner can only access their own truck
    if (req.user.role === "truck_owner" && truck.truckOwnerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden: Not your truck", data: null });
    }

    res.status(200).json({ success: true, message: "Truck fetched successfully", data: truck });
  } catch (error: any) {
    logger.error("Error getTruckById ",error);
    res.status(500).json({ success: false, message: error.message || "Server error", data: null });
  }
};

// UPDATE TRUCK
export const updateTruck = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    const truck = await Truck.findById(req.params.id);
    if (!truck) return res.status(404).json({ success: false, message: "Truck not found", data: null });

    // Truck owner can only update their own truck
    if (req.user.role === "truck_owner" && truck.truckOwnerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden: Not your truck", data: null });
    }

    const updatedTruck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Truck updated successfully", data: updatedTruck });
  } catch (error: any) {
    logger.error("Error in updateTruck",error)
    res.status(500).json({ success: false, message: error.message || "Server error", data: null });
  }
};

// DELETE TRUCK
export const deleteTruck = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    const truck = await Truck.findById(req.params.id);
    if (!truck) return res.status(404).json({ success: false, message: "Truck not found", data: null });

    // Truck owner can only delete their own truck
    if (req.user.role === "truck_owner" && truck.truckOwnerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden: Not your truck", data: null });
    }

    await truck.deleteOne();
    res.status(200).json({ success: true, message: "Truck deleted successfully", data: null });
  } catch (error: any) {
    logger.error("Error in deleteTruck controller",error)
    res.status(500).json({ success: false, message: error.message || "Server error", data: null });
  }
};
// GET TRUCKS OF SPECIFIC TRUCK OWNER
export const getTrucksByOwner = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    const { truckOwnerId } = req.params;

    if (!truckOwnerId) {
      return res.status(400).json({ success: false, message: "Truck owner ID is required", data: null });
    }

    // Only admin or customer can fetch other owner's trucks
    if (req.user.role === "truck_owner") {
      return res.status(403).json({ success: false, message: "Forbidden", data: null });
    }

    const trucks = await Truck.find({ truckOwnerId }).select(
      "truckNumber truckType capacity fuelType city state status"
    );

    res.status(200).json({ success: true, message: "Trucks fetched successfully", data: trucks });
  } catch (error: any) {
    logger.error("Error fetching trucks by owner:", error);
    res.status(500).json({ success: false, message: error.message || "Server error", data: null });
  }
};
