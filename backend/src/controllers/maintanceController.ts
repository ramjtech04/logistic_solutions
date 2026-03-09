import { Request, Response } from "express";
import Maintenance from "../models/maintance";
import logger from "../utils/logger";

export const addMaintenance = async (req: Request, res: Response) => {
  try {
    const { vehicle, date, expenses } = req.body;

    const maintenance = new Maintenance({
      vehicle,
      date,
      expenses,
      softDeletedByAdmin: false,
      softDeletedByTruckOwner: false,
     
    });

    await maintenance.save();

    res.status(201).json({
      success: true,
      message: "Maintenance record added successfully",
      data: maintenance,
    });
  } catch (error) {
    
    logger.error("Error adding maintenance:", error);
   return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getMaintenance = async (req: Request, res: Response) => {
   try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let maintenance;

    if (req.user.role === "admin") {
      // Admin sees all maintenance
      maintenance = await Maintenance.find({softDeletedByAdmin:false})
        .populate("vehicle")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "truck_owner") {
      // Truck owner sees only their trucks
      maintenance = await Maintenance.find({ softDeletedByTruckOwner: false })
        .populate({
          path: "vehicle",
          match: { truckOwnerId: req.user.id },
        })
        .sort({ createdAt: -1 });

      // Remove records where vehicle doesn't belong to this owner
      maintenance = maintenance.filter((m) => m.vehicle !== null);
    } else {
      // Other roles (customer, etc.) get nothing
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.json({ success: true, data: maintenance });
  } catch (error) {
    console.error("Error fetching maintenance:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getMaintenanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await Maintenance.findById(id)
     .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  }
    catch (error) {
    logger.error("Error fetching maintenance records by vehicle:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
    }

};

export const updateMaintenance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, expenses, amount } = req.body;
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      id,
      { date, expenses, amount },
      { new: true }
    ).populate("vehicle");
    if (!updatedMaintenance) {
        return res.status(404).json({ success: false, message: "Maintenance record not found" });
    }
    res.json({
      success: true,
      message: "Maintenance record updated successfully",
      data: updatedMaintenance,
    });
  } catch (error) {
    logger.error("Error updating maintenance record:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteMaintenance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    if (req.user.role === "admin") {
      // Admin soft delete
      if (maintenance.softDeletedByTruckOwner) {
        // Truck owner already soft deleted → hard delete
        await Maintenance.findByIdAndDelete(id);
        return res.json({ success: true, message: "Maintenance record permanently deleted" });
      }
      maintenance.softDeletedByAdmin = true;
      await maintenance.save();
      return res.json({ success: true, message: "Maintenance record soft deleted by admin" });
    } else if (req.user.role === "truck_owner") {
      // Truck owner soft delete
      if (maintenance.softDeletedByAdmin) {
        // Admin already soft deleted → hard delete
        await Maintenance.findByIdAndDelete(id);
        return res.json({ success: true, message: "Maintenance record permanently deleted" });
      }
      maintenance.softDeletedByTruckOwner = true;
      await maintenance.save();
      return res.json({ success: true, message: "Maintenance record soft deleted by truck owner" });
    } else {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
  } catch (error) {
    logger.error("Error deleting maintenance record:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};