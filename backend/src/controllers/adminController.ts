//get all requests irrespective of status
//get those request that have status=Accepted
//Approve a request
//Reject a request
//Manually assign truck to request
import mongoose from "mongoose";
import { Request, Response } from "express";
import RequestModel from "../models/requestModel";
import Truck from "../models/truckModel";
import { sendEmail } from "../utils/sendEmail";
import { RequestStatus } from "../enums/statusEnums";
import { updateRequestStatus } from "../services/statusService";

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find()
      .populate("customerId", "name email phone")
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity")
      .populate("approvedByAdminId", "name email");

    return res.status(200).json({ success: true, requests });
  } catch (error: any) {
    console.error("Error fetching all requests:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAcceptedRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find({
      requestStatus: { $in: [RequestStatus.Accepted] }
    })
      .populate("customerId", "name email phone")
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity")
      .populate("approvedByAdminId", "name email");

    return res.status(200).json({ success: true, requests });
  } catch (error: any) {
    console.error("Error fetching accepted requests:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Approve a request
export const approveRequest = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const adminId = req.user?.id;

    if (!requestId) {
      return res.status(400).json({ success: false, message: "Request ID is required" });
    }
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Use status service
    const updatedRequest = await updateRequestStatus(
      requestId,
      RequestStatus.Approved,
      { adminId }
    );

    await updatedRequest.populate("customerId", "name email phone");
    await updatedRequest.populate("acceptedByTruckOwnerId", "name email phone");
    await updatedRequest.populate("acceptedTruckId", "truckNumber truckType capacity");

    const customer: any = updatedRequest.customerId;
    const truckOwner: any = updatedRequest.acceptedByTruckOwnerId;
    const truck: any = updatedRequest.acceptedTruckId;
    // Email notifications
    if (customer?.email) {
      await sendEmail({
        to: customer.email,
        subject: "Your Request has been Approved ✅",
        text: `Hello ${customer.name}, 
Your request has been reviewed and approved by the admin. 

Details:
- Truck Assigned: ${truck?.truckNumber || "Not Assigned"}
- Truck Owner: ${truckOwner?.name || "Not available"}
- Contact: ${truckOwner?.phone || "Not available"}

Our team will contact you soon for further updates.`,
      });
    }

    if (truckOwner?.email) {
      await sendEmail({
        to: truckOwner.email,
        subject: "Admin Approved Your Request ✅",
        text: `Hello ${truckOwner.name}, 
The admin has approved the customer request you accepted. 

Details:
- Customer: ${customer?.name || "Not available"}
- Contact: ${customer?.phone || "Not available"}
- Truck Assigned: ${truck?.truckNumber || "Not defined"}

Please coordinate with the customer to proceed further.`,
      });
    }

    return res.status(200).json({ success: true, request: updatedRequest });
  } catch (error: any) {
    console.error("Error approving request:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Reject a request
export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const adminId = req.user?.id;
    const { reason } = req.body;

    if (!requestId) {
      return res.status(400).json({ success: false, message: "Request ID is required" });
    }
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Use status service
    const updatedRequest = await updateRequestStatus(
      requestId,
      RequestStatus.Cancelled,
      { adminId }
    );

    await updatedRequest.populate("customerId", "name email phone");
    await updatedRequest.populate("acceptedByTruckOwnerId", "name email phone");
    await updatedRequest.populate("acceptedTruckId", "truckNumber truckType capacity");

    // Rollback truck if assigned
    if (updatedRequest.acceptedTruckId) {
      await Truck.findByIdAndUpdate(updatedRequest.acceptedTruckId, { status: "available" });
    }

    const customer: any = updatedRequest.customerId;
    const truckOwner: any = updatedRequest.acceptedByTruckOwnerId;
    const truck: any = updatedRequest.acceptedTruckId;
    // Email notifications
    if (customer?.email) {
      await sendEmail({
        to: customer.email,
        subject: "Your Request has been Rejected ❌",
        text: `Hello ${customer.name},
        Unfortunately, your transport request has been rejected.
        🔹 Request ID: ${updatedRequest._id}
        🔹 Truck Assigned: ${truck?.truckNumber || "N/A"} (${truck?.truckType || "N/A"})
        🔹 Reason: ${reason || "Not specified"}
          Please contact support if you need further assistance.`,
      });
    }

    if (truckOwner?.email) {
      await sendEmail({
        to: truckOwner.email,
        subject: "Request You Accepted has been Rejected ❌",
        text: `Hello ${truckOwner.name},
        The request you accepted has been rejected by the admin.
        🔹 Request ID: ${updatedRequest._id}
        🔹 Customer: ${customer?.name || "N/A"}
        🔹 Truck: ${truck?.truckNumber || "N/A"} (${truck?.truckType || "N/A"})
        🔹 Reason: ${reason || "Not specified"}
          You may look for new available requests.`,
      });
    }

    return res.status(200).json({ success: true, request: updatedRequest });
  } catch (error: any) {
    console.error("Error rejecting request:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};





//Manual Assignment
export const manualAssignRequest = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id;
    const { requestId, truckId, truckOwnerId } = req.body;

    if (!adminId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!requestId || !truckId)
      return res.status(400).json({ success: false, message: "Request ID and Truck ID required" });

    const request = await RequestModel.findById(requestId);
    if (!request)
      return res.status(404).json({ success: false, message: "Request not found" });

    const truck = await Truck.findOne({ _id: truckId, status: "available" });
    if (!truck)
      return res.status(400).json({ success: false, message: "Truck not available" });

    // Assign truck
    request.assignedTruckId = truck._id as mongoose.Types.ObjectId;

    // Assign truck owner if provided
    if (truckOwnerId) {
      if (mongoose.Types.ObjectId.isValid(truckOwnerId)) {
        request.acceptedByTruckOwnerId = new mongoose.Types.ObjectId(truckOwnerId);
      } else {
        return res.status(400).json({ success: false, message: "Invalid truckOwnerId" });
      }
    }

    request.requestStatus = RequestStatus.Approved;
    request.approvedByAdminId = adminId;

    await request.save();

    // Update truck status
    truck.status = "busy";
    await truck.save();

    // Populate only required fields for frontend
    const populatedRequest = await RequestModel.findById(request._id)
      .populate("customerId", "name email phone")
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("assignedTruckId", "truckNumber truckType capacity")
      .populate("approvedByAdminId", "name email");
      
    if (!populatedRequest) {
      return res.status(500).json({ success: false, message: "Request not found after saving" });
    }
    // Prepare frontend-friendly response
    const responseData = {
      _id: populatedRequest?._id,
      requestStatus: populatedRequest?.requestStatus,
      customer: populatedRequest?.customerId,
      truckOwner: populatedRequest?.acceptedByTruckOwnerId,
      truck: populatedRequest?.assignedTruckId,
      approvedByAdmin: populatedRequest?.approvedByAdminId,
      createdAt: populatedRequest?.createdAt,
      updatedAt: populatedRequest?.updatedAt,
    };

    // Email to customer
    const customer: any = populatedRequest?.customerId;
    const truckOwner: any = populatedRequest?.acceptedByTruckOwnerId;
    const assignedTruck: any = populatedRequest?.assignedTruckId;

    if (customer?.email) {
      await sendEmail({
        to: customer.email,
        subject: "Your Request has been Assigned by Admin ✅",
        text: `Hello ${customer.name},
Your transport request has been manually assigned by the admin.

Details:
- Truck Assigned: ${assignedTruck?.truckNumber || "Not Assigned"} (${assignedTruck?.truckType || "N/A"})
- Truck Owner: ${truckOwner?.name || "Not assigned"}
- Contact: ${truckOwner?.phone || "Not available"}
- Request ID: ${populatedRequest._id}

Our team will contact you soon for further updates.`,
      });
    }

    if (truckOwner?.email) {
      await sendEmail({
        to: truckOwner.email,
        subject: "You have been Assigned a Request by Admin ✅",
        text: `Hello ${truckOwner.name},
The admin has manually assigned you to a customer request.

Details:
- Customer: ${customer?.name || "Not available"}
- Contact: ${customer?.phone || "Not available"}
- Truck Assigned: ${assignedTruck?.truckNumber || "Not defined"} (${assignedTruck?.truckType || "N/A"})
- Request ID: ${populatedRequest._id}

Please coordinate with the customer to proceed further.`,
      });
    }

    return res.status(200).json({ success: true, request: responseData });
  } catch (error: any) {
    console.error("Error in manual assignment:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a request
export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id;
    const requestId = req.params.id;

    if (!adminId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!requestId)
      return res.status(400).json({ success: false, message: "Request ID is required" });

    const request = await RequestModel.findById(requestId);
    if (!request)
      return res.status(404).json({ success: false, message: "Request not found" });

    // Delete the request
    await RequestModel.findByIdAndDelete(requestId);

    // free the assigned truck if any
    if (request.assignedTruckId) {
      await Truck.findByIdAndUpdate(request.assignedTruckId, { status: "available" });
    }

    return res.status(200).json({ success: true, message: "Request deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting request:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
