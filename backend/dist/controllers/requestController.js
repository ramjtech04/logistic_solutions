"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAvailableTrucks = exports.acceptRequest = exports.getPendingRequests = exports.getMyRequests = exports.createRequest = void 0;
const requestModel_1 = __importDefault(require("../models/requestModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const truckModel_1 = __importDefault(require("../models/truckModel"));
const sendEmail_1 = require("../utils/sendEmail");
const statusEnums_1 = require("../enums/statusEnums");
const logger_1 = __importDefault(require("../utils/logger"));
//Create a new delivery request
const createRequest = async (req, res) => {
    try {
        const { customerId, pickupState, pickupCity, pickupAddress, dropState, dropCity, dropAddress, loadType, loadWeight } = req.body;
        // const customerId = req.user?.id;
        if (!customerId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const newRequest = new requestModel_1.default({
            customerId,
            pickupState, pickupCity, pickupAddress,
            dropState, dropCity, dropAddress,
            loadType, loadWeight,
            requestStatus: statusEnums_1.RequestStatus.Pending,
            deliveryStatus: statusEnums_1.DeliveryStatus.NotStarted,
        });
        await newRequest.save();
        const customer = await userModel_1.default.findById(customerId).select("name email phone");
        await (0, sendEmail_1.sendEmail)({
            to: process.env.EMAIL_USER,
            subject: "📦 New Delivery Request from Customer",
            text: `
New Delivery Request from Customer `,
            html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2 style="color: #007BFF;">📦 New Delivery Request from Customer</h2
            <p><strong>Customer Name:</strong> ${customer?.name}</p
            <p><strong>Customer Email:</strong> ${customer?.email}</p
              
            <p><strong>Customer Contact:</strong> ${customer?.phone}</p
            <p><strong>Pickup Address:</strong> ${pickupAddress}, ${pickupCity}, ${pickupState}</p
            <p><strong>Drop Address:</strong> ${dropAddress}, ${dropCity}, ${dropState}</p
            <p><strong>Load Type:</strong> ${loadType}</p
            <p><strong>Load Weight:</strong> ${loadWeight}</p
            `,
            sendToAdmins: true
        });
        return res.status(201).json({ success: true, message: "Request created successfully", request: newRequest });
    }
    catch (error) {
        logger_1.default.error("Error creating request:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.createRequest = createRequest;
//Get requests of logged-in customer
const getMyRequests = async (req, res) => {
    try {
        const customerId = req.user?.id;
        if (!customerId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const requests = await requestModel_1.default.find({ customerId })
            .populate("acceptedByTruckOwnerId", "name email phone")
            .populate("acceptedTruckId", "truckNumber truckType capacity")
            .populate("assignedTruckId", "truckNumber truckType capacity")
            .populate("approvedByAdminId", "name email");
        return res.status(200).json({ success: true, requests });
    }
    catch (error) {
        logger_1.default.error("Error fetching customer requests:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getMyRequests = getMyRequests;
//Get all requests with status "pending" 
const getPendingRequests = async (req, res) => {
    try {
        const requests = await requestModel_1.default.find({ requestStatus: statusEnums_1.RequestStatus.Pending })
            .select("pickupState pickupCity pickupAddress dropState dropCity dropAddress loadType loadWeight createdAt");
        return res.status(200).json({ success: true, requests });
    }
    catch (error) {
        logger_1.default.error("Error fetching available requests:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getPendingRequests = getPendingRequests;
//Truck owner accepts a request and assigns truck
const acceptRequest = async (req, res) => {
    try {
        const truckOwnerId = req.user?.id;
        const requestId = req.params.id;
        const { truckId } = req.body;
        if (!truckOwnerId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        if (!requestId)
            return res.status(400).json({ success: false, message: "Request ID is required" });
        //Finding request
        const request = await requestModel_1.default.findById(requestId);
        if (!request)
            return res.status(404).json({ success: false, message: "Request not found" });
        if (request.requestStatus !== statusEnums_1.RequestStatus.Pending) {
            await truckModel_1.default.findByIdAndUpdate(truckId, { status: "available" });
            return res.status(400).json({ success: false, message: "Request already accepted" });
        }
        // Check truck availability
        const truck = await truckModel_1.default.findOneAndUpdate({ _id: truckId, truckOwnerId, status: "available" }, { status: "busy" }, { new: true });
        if (!truck)
            return res.status(400).json({ success: false, message: "Invalid truck or truck busy" });
        // Update request 
        request.requestStatus = statusEnums_1.RequestStatus.Accepted;
        request.acceptedByTruckOwnerId = truckOwnerId;
        request.acceptedTruckId = truckId;
        await request.save();
        const customer = await userModel_1.default.findById(request.customerId).select("name email phone");
        // Get all admins
        await (0, sendEmail_1.sendEmail)({
            to: process.env.EMAIL_USER,
            subject: "🚚 Request Accepted by Truck Owner",
            text: `Truck Owner accepted a Request`,
            html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #007BFF;">🚚 Request Accepted by Truck Owner</h2
      <p>Dear Admin,</p>
      <p>A truck owner has accepted a delivery request.</p>
      <h3>Important Details:</h3>
      <ul>

        <li><strong>Request ID:</strong> ${request._id}</li>
        <li><strong>Customer:</strong> ${customer?.name} (${customer?.phone || "No phone"})</li>
        <li><strong>Truck Assigned:</strong> ${truck?.truckNumber || "Not assigned"} (${truck?.truckType || "N/A"})</li>
        <li><strong>Pickup Location:</strong> ${request.pickupAddress}, ${request.pickupCity}, ${request.pickupState}</li>
        <li><strong>Drop Location:</strong> ${request.dropAddress}, ${request.dropCity}, ${request.dropState}</li>
        <li><strong>Load Type:</strong> ${request.loadType}</li>
        <li><strong>Load Weight:</strong> ${request.loadWeight}</li>
      </ul>
      <p>Please follow up accordingly.</p>
        `,
            sendToAdmins: true
        });
        return res.status(200).json({ success: true, request });
    }
    catch (error) {
        logger_1.default.error("Error accepting request:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.acceptRequest = acceptRequest;
//Get all available trucks of logged-in truck owner
const getMyAvailableTrucks = async (req, res) => {
    try {
        const truckOwnerId = req.user?.id;
        if (!truckOwnerId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const trucks = await truckModel_1.default.find({ truckOwnerId, status: "available" })
            .select("truckNumber truckType capacity fuelType city state");
        return res.status(200).json({ success: true, trucks });
    }
    catch (error) {
        logger_1.default.error("Error fetching available trucks:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getMyAvailableTrucks = getMyAvailableTrucks;
//# sourceMappingURL=requestController.js.map