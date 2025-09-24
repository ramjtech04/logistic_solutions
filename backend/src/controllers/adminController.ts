import { Request, Response } from "express";
import RequestModel from "../models/requestModel";
import Truck from "../models/truckModel";
import User from "../models/userModel";
import { sendEmail } from "../utils/sendEmail";

// Get all requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find()
      .populate("customerId", "name email phone")
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity");

    return res.status(200).json({ success: true, requests });
  } catch (error: any) {
    console.error("Error fetching all requests:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
// Get only accepted requests
export const getAcceptedRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find({ requestStatus: "Accepted" })
      .populate("customerId", "name email phone")
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity fuelType");

    return res.status(200).json({ success: true, requests });
  } catch (error: any) {
    console.error("Error fetching accepted requests:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Approve a request
export const approveRequest = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const adminId = req.user?.id;

    // fetch the request 
    const request = await RequestModel.findById(requestId)
      .populate("customerId", "name email phone")
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity fuelType");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Validation: Only approve if truck owner + truck are assigned
    if (!request.acceptedByTruckOwnerId || !request.acceptedTruckId) {
      return res.status(400).json({
        success: false,
        message: "Request cannot be approved without truck owner and assigned truck"
      });
    }

    // Now update request to Approved
    request.requestStatus = "Approved";
    request.approvedByAdminId = adminId;
    await request.save();

    const customer = request.customerId as any;
    const truckOwner = request.acceptedByTruckOwnerId as any;
    const truck = request.acceptedTruckId as any;

    // Send emails
    if (customer?.email) {
      await sendEmail({
        to: customer.email,
        subject: "Your Request has been Approved ✅",
        text: `Hello ${customer.name}, your request has been approved by the admin. 
Truck Owner: ${truckOwner?.name || "N/A"} (${truckOwner?.email || "N/A"}, ${truckOwner?.phone || "N/A"}) 
Truck: ${truck?.truckNumber || "N/A"} (${truck?.truckType || "N/A"}, ${truck?.capacity || "N/A"} tons)`,
        html: `
          <h3>Good News 🎉</h3>
          <p>Hello <strong>${customer.name}</strong>,</p>
          <p>Your delivery request <b>${request._id}</b> has been <span style="color:green">approved</span> by the admin.</p>
          <h4>Truck Owner Details:</h4>
          <ul>
            <li><b>Name:</b> ${truckOwner?.name || "N/A"}</li>
            <li><b>Email:</b> ${truckOwner?.email || "N/A"}</li>
            <li><b>Phone:</b> ${truckOwner?.phone || "N/A"}</li>
          </ul>
          <h4>Truck Assigned:</h4>
          <ul>
            <li><b>Truck Number:</b> ${truck?.truckNumber || "N/A"}</li>
            <li><b>Type:</b> ${truck?.truckType || "N/A"}</li>
            <li><b>Capacity:</b> ${truck?.capacity || "N/A"} tons</li>
            <li><b>Fuel Type:</b> ${truck?.fuelType || "N/A"}</li>
          </ul>
          <p>Please contact the truck owner directly for further coordination.</p>
        `
      });
    }

    if (truckOwner?.email) {
      await sendEmail({
        to: truckOwner.email,
        subject: "Admin Approved Your Request ✅",
        text: `Hello ${truckOwner.name}, the admin approved the request you accepted. 
Customer: ${customer?.name || "N/A"} (${customer?.email || "N/A"}, ${customer?.phone || "N/A"}) 
Pickup: ${request.pickupAddress}, ${request.pickupCity}, ${request.pickupState} 
Drop: ${request.dropAddress}, ${request.dropCity}, ${request.dropState}`,
        html: `
          <h3>Request Approved</h3>
          <p>Hello <strong>${truckOwner.name}</strong>,</p>
          <p>The admin has approved the request <b>${request._id}</b> that you accepted.</p>
          <h4>Customer Details:</h4>
          <ul>
            <li><b>Name:</b> ${customer?.name || "N/A"}</li>
            <li><b>Email:</b> ${customer?.email || "N/A"}</li>
            <li><b>Phone:</b> ${customer?.phone || "N/A"}</li>
          </ul>
          <h4>Request Details:</h4>
          <ul>
            <li><b>Pickup:</b> ${request.pickupAddress}, ${request.pickupCity}, ${request.pickupState}</li>
            <li><b>Drop:</b> ${request.dropAddress}, ${request.dropCity}, ${request.dropState}</li>
            <li><b>Load Type:</b> ${request.loadType}</li>
            <li><b>Load Weight:</b> ${request.loadWeight} kg</li>
          </ul>
          <p>Please contact the customer to coordinate pickup and delivery.</p>
        `
      });
    }

    return res.status(200).json({ success: true, request });
  } catch (error: any) {
    console.error("Error approving request:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const { reason } = req.body;

    // Find the request first
    const request = await RequestModel.findById(requestId)
      .populate("customerId", "name email phone")
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    //  Check if a truck owner has accepted the request
    if (!request.acceptedByTruckOwnerId) {
      return res.status(400).json({
        success: false,
        message: "Cannot reject request: No truck owner has accepted this request yet"
      });
    }

    // Update request status to Rejected
    request.requestStatus = "Cancelled";
    await request.save();

    // Rollback truck status if previously assigned
    if (request.acceptedTruckId) {
      await Truck.findByIdAndUpdate(request.acceptedTruckId, { status: "available" });
    }

    const customer = request.customerId as any;
    const truckOwner = request.acceptedByTruckOwnerId as any;
    const truck = request.acceptedTruckId as any;

    // Email to customer
    if (customer?.email) {
      await sendEmail({
        to: customer.email,
        subject: "Your Request has been Rejected",
        text: `Hello ${customer.name}, your request (ID: ${request._id}) has been rejected. Reason: ${reason || "Not specified"}.`,
        html: `
          <p>Hello ${customer.name},</p>
          <p>Your request <b>ID: ${request._id}</b> has been rejected.</p>
          ${truck ? `<p><b>Truck Assigned:</b> ${truck.truckNumber} (${truck.truckType}, Capacity: ${truck.capacity})</p>` : ""}
          <p><b>Reason:</b> ${reason || "Not specified"}</p>
        `
      });
    }

    // Email to truck owner
    if (truckOwner?.email) {
      await sendEmail({
        to: truckOwner.email,
        subject: "Request You Accepted has been Rejected",
        text: `Hello ${truckOwner.name}, the request (ID: ${request._id}) you accepted has been rejected. Reason: ${reason || "Not specified"}.`,
        html: `
          <p>Hello ${truckOwner.name},</p>
          <p>The request <b>ID: ${request._id}</b> that you accepted has been rejected by the admin.</p>
          ${customer ? `<p><b>Customer:</b> ${customer.name} (${customer.email}, ${customer.phone})</p>` : ""}
          ${truck ? `<p><b>Truck Assigned:</b> ${truck.truckNumber} (${truck.truckType}, Capacity: ${truck.capacity})</p>` : ""}
          <p><b>Reason:</b> ${reason || "Not specified"}</p>
        `
      });
    }

    return res.status(200).json({ success: true, request });
  } catch (error: any) {
    console.error("Error rejecting request:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
