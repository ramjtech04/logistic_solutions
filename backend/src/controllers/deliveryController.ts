// controllers/deliveryController.ts
import { Request, Response } from "express";
import RequestModel from "../models/requestModel";
import { Types } from "mongoose";

/**
 * Update delivery status (Admin or Truck Owner)
 * PATCH /api/delivery/updatestatus/:id
 */
export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!requestId || !Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: "Invalid request ID" });
    }
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const request: any = await RequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Just update the delivery status directly
    request.deliveryStatus = status;
    await request.save();

    return res.status(200).json({ success: true, request });
  } catch (error: any) {
    console.error("Error updating delivery status:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get deliveries assigned to logged-in Truck Owner
 * GET /api/delivery/my
 */
export const getMyDeliveries = async (req: Request, res: Response) => {
  try {
    const truckOwnerId = req.user?.id;

    if (!truckOwnerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const deliveries = await RequestModel.find({
      acceptedByTruckOwnerId: truckOwnerId,
    })
      .populate("customerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity")
      .populate("assignedTruckId","truckNumber truckType capacity")

    return res.status(200).json({ success: true, deliveries });
  } catch (error: any) {
    console.error("Error fetching deliveries:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get delivery status (Customer/Admin/TruckOwner)
 * GET /api/delivery/:id
 */
export const getDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;

    if (!requestId || !Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: "Invalid request ID" });
    }

    const request: any = await RequestModel.findById(requestId)
      .populate("customerId", "name email phone")
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    return res.status(200).json({
      success: true,
      deliveryStatus: request.deliveryStatus,
      request,
    });
  } catch (error: any) {
    console.error("Error fetching delivery status:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
