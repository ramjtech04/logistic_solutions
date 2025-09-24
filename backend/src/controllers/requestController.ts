import { Request, Response } from "express";
import RequestModel, { IRequest } from "../models/requestModel";
import User from "../models/userModel";
import Truck from "../models/truckModel";
import { sendEmail } from "../utils/sendEmail";

// Create a new delivery request
export const createRequest = async (req: Request, res: Response) => {
    try {
        const {
            pickupState,
            pickupCity,
            pickupAddress,
            dropState,
            dropCity,
            dropAddress,
            loadType,
            loadWeight,
        } = req.body;

        const customerId = req.user?.id;
        if (!customerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Create new request
        const newRequest: IRequest = new RequestModel({
            customerId,
            pickupState,
            pickupCity,
            pickupAddress,
            dropState,
            dropCity,
            dropAddress,
            loadType,
            loadWeight,
        });

        await newRequest.save();
const customer = await User.findById(customerId).select("name email phone");
        // Send notification email to admin
        await sendEmail({
  to: process.env.EMAIL_USER!,
  subject: "New Delivery Request from Customer",
  text: `Customer ${customer?.name} (${customer?.email}, ${customer?.phone}) created a new request.`,
  html: `
    <h3>New Request Received</h3>
    <p><strong>Customer:</strong> ${customer?.name} (${customer?.email}, ${customer?.phone})</p>
    <p><strong>Pickup:</strong> ${newRequest.pickupAddress}, ${newRequest.pickupCity}, ${newRequest.pickupState}</p>
    <p><strong>Drop:</strong> ${newRequest.dropAddress}, ${newRequest.dropCity}, ${newRequest.dropState}</p>
    <p><strong>Load Type:</strong> ${newRequest.loadType}</p>
    <p><strong>Load Weight:</strong> ${newRequest.loadWeight} kg</p>
    <p><strong>Status:</strong> ${newRequest.requestStatus}</p>
  `,
});

        return res.status(201).json({
            success: true,
            message: "Request created successfully",
            request: newRequest,
        });
    } catch (error: any) {
        console.error("Error creating request:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all requests of the logged-in customer
export const getMyRequests = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.id;
        if (!customerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const requests = await RequestModel.find({ customerId })
            .populate("acceptedByTruckOwnerId", "name email phone")
            .populate("acceptedTruckId", "truckNumber truckType capacity")
            .populate("assignedTruckId", "truckNumber truckType capacity")
            .populate("approvedByAdminId", "name email");

        return res.status(200).json({
            success: true,
            requests,
        });
    } catch (error: any) {
        console.error("Error fetching customer requests:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
// Get all pending requests for truck owners
export const getAvailableRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find({ requestStatus: "Pending" })
      .select("pickupState pickupCity pickupAddress dropState dropCity dropAddress loadType loadWeight createdAt");

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error: any) {
    console.error("Error fetching available requests:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
// Truck owner accepts a request
export const acceptRequest = async (req: Request, res: Response) => {
  try {
    const truckOwnerId = req.user?.id;
    const requestId = req.params.id;
    const { truckId } = req.body;

    if (!truckOwnerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Verify the truck belongs to this truck owner and is available
    const truck = await Truck.findOneAndUpdate(
      { _id: truckId, truckOwnerId, status: "available" }, // only if truck is available
      { status: "busy" }, // mark truck as busy
      { new: true }
    );
    if (!truck) {
      return res.status(400).json({ success: false, message: "Invalid truck selection or truck already busy" });
    }

    // Atomic update: only accept if request is still pending
    const updatedRequest = await RequestModel.findOneAndUpdate(
      { _id: requestId, requestStatus: "Pending" },
      {
        acceptedByTruckOwnerId: truckOwnerId,
        acceptedTruckId: truckId,
        requestStatus: "Accepted",
      },
      { new: true }
    ).populate<{ customerId: { name: string; email: string; phone: string } }>(
      "customerId",
      "name email phone"
    );

    if (!updatedRequest) {
      // If request already accepted, rollback truck status
      await Truck.findByIdAndUpdate(truckId, { status: "available" });
      return res.status(400).json({ success: false, message: "Request already accepted by someone else" });
    }

    // Send email to admin about acceptance
    const truckOwner = await User.findById(truckOwnerId).select("name email phone");
    const customer = updatedRequest.customerId;

    await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: "Request Accepted by Truck Owner",
      text: `Truck Owner ${truckOwner?.name} accepted Request ${updatedRequest._id}`,
      html: `
        <h3>Request Accepted</h3>
        <p><strong>Truck Owner:</strong> ${truckOwner?.name} (${truckOwner?.email}, ${truckOwner?.phone})</p>
        <p><strong>Truck:</strong> ${truck.truckNumber} (${truck.truckType}, ${truck.capacity} tons)</p>
        <p><strong>Customer:</strong> ${customer.name} (${customer.email}, ${customer.phone})</p>
        <p><strong>Pickup:</strong> ${updatedRequest.pickupAddress}, ${updatedRequest.pickupCity}, ${updatedRequest.pickupState}</p>
        <p><strong>Drop:</strong> ${updatedRequest.dropAddress}, ${updatedRequest.dropCity}, ${updatedRequest.dropState}</p>
        <p>For Approval,Go to Admin Dashboard</p>
      `,
    });

    return res.status(200).json({ success: true, request: updatedRequest });
  } catch (error: any) {
    console.error("Error accepting request:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
// Get all available trucks for logged-in truck owner
export const getMyAvailableTrucks = async (req: Request, res: Response) => {
  try {
    const truckOwnerId = req.user?.id;
    if (!truckOwnerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const trucks = await Truck.find({ truckOwnerId, status: "available" })
      .select("truckNumber truckType capacity fuelType city state");

    return res.status(200).json({ success: true, trucks });
  } catch (error: any) {
    console.error("Error fetching available trucks:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

