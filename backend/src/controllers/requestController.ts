//create new request (role=customer)
//get all request of logged in customer
//all request with status="pending" (role="truck_owner")
//truck owner accepts a request
//trucks of logged in truck_owner with status="available"
import { Request, Response } from "express";
import RequestModel, { IRequest } from "../models/requestModel";
import User from "../models/userModel";
import Truck from "../models/truckModel";
import { sendEmail } from "../utils/sendEmail";
import { RequestStatus, DeliveryStatus } from "../enums/statusEnums";

//Create a new delivery request
export const createRequest = async (req: Request, res: Response) => {
  try {
    const {
      pickupState, pickupCity, pickupAddress,
      dropState, dropCity, dropAddress,
      loadType, loadWeight
    } = req.body;

    const customerId = req.user?.id;
    if (!customerId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const newRequest: IRequest = new RequestModel({
      customerId,
      pickupState, pickupCity, pickupAddress,
      dropState, dropCity, dropAddress,
      loadType, loadWeight,
      requestStatus: RequestStatus.Pending,
      deliveryStatus: DeliveryStatus.NotStarted,
    });

    await newRequest.save();

    const customer = await User.findById(customerId).select("name email phone");

    await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: "New Delivery Request from Customer",
      text: `Customer created a new request.
      Details:
        Customer Name:${customer?.name}
        Customer Email:${customer?.email}
        Customer Contact:${customer?.phone}
      `,
    });

    return res.status(201).json({ success: true, message: "Request created successfully", request: newRequest });
  } catch (error: any) {
    console.error("Error creating request:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Get requests of logged-in customer
export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const requests = await RequestModel.find({ customerId })
      .populate("acceptedByTruckOwnerId", "name email phone")
      .populate("acceptedTruckId", "truckNumber truckType capacity")
      .populate("assignedTruckId", "truckNumber truckType capacity")
      .populate("approvedByAdminId", "name email");

    return res.status(200).json({ success: true, requests });
  } catch (error: any) {
    console.error("Error fetching customer requests:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Get all pending requests for truck owners
export const getAvailableRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find({ requestStatus: RequestStatus.Pending })
      .select("pickupState pickupCity pickupAddress dropState dropCity dropAddress loadType loadWeight createdAt");

    return res.status(200).json({ success: true, requests });
  } catch (error: any) {
    console.error("Error fetching available requests:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Truck owner accepts a request
export const acceptRequest = async (req: Request, res: Response) => {
  try {
    const truckOwnerId = req.user?.id;
    const requestId = req.params.id;
    const { truckId } = req.body;

    if (!truckOwnerId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!requestId) return res.status(400).json({ success: false, message: "Request ID is required" });

    // Check truck availability
    const truck = await Truck.findOneAndUpdate(
      { _id: truckId, truckOwnerId, status: "available" },
      { status: "busy" },
      { new: true }
    );
    if (!truck) return res.status(400).json({ success: false, message: "Invalid truck or truck busy" });

    // Update request directly
    const request = await RequestModel.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.requestStatus !== RequestStatus.Pending) {
      await Truck.findByIdAndUpdate(truckId, { status: "available" });
      return res.status(400).json({ success: false, message: "Request already accepted" });
    }

    request.requestStatus = RequestStatus.Accepted;
    request.acceptedByTruckOwnerId = truckOwnerId;
    request.acceptedTruckId = truckId;
    await request.save();

    const customer: any = await User.findById(request.customerId).select("name email phone");

    await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: "Request Accepted by Truck Owner",
      text: `Truck Owner accepted a Request
      Important Details:
- Request ID: ${request._id}
- Customer: ${customer?.name} (${customer?.phone || "No phone"})
- Truck Assigned: ${truck?.truckNumber || "Not assigned"} (${truck?.truckType || "N/A"})

Please follow up accordingly.`,
    });

    return res.status(200).json({ success: true, request });
  } catch (error: any) {
    console.error("Error accepting request:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Get available trucks of logged-in truck owner
export const getMyAvailableTrucks = async (req: Request, res: Response) => {
  try {
    const truckOwnerId = req.user?.id;
    if (!truckOwnerId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const trucks = await Truck.find({ truckOwnerId, status: "available" })
      .select("truckNumber truckType capacity fuelType city state");

    return res.status(200).json({ success: true, trucks });
  } catch (error: any) {
    console.error("Error fetching available trucks:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
