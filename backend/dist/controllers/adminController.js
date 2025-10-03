"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.manualAssignRequest = exports.rejectRequest = exports.approveRequest = exports.getAcceptedRequests = exports.getAllRequests = void 0;
//get all requests irrespective of status
//get those request that have status=Accepted
//Approve a request
//Reject a request
//Manually assign truck to request
const mongoose_1 = __importDefault(require("mongoose"));
const requestModel_1 = __importDefault(require("../models/requestModel"));
const truckModel_1 = __importDefault(require("../models/truckModel"));
const sendEmail_1 = require("../utils/sendEmail");
const statusEnums_1 = require("../enums/statusEnums");
const statusService_1 = require("../services/statusService");
const getAllRequests = async (req, res) => {
    try {
        const requests = await requestModel_1.default.find()
            .populate("customerId", "name email phone")
            .populate("acceptedByTruckOwnerId", "name email phone")
            .populate("acceptedTruckId", "truckNumber truckType capacity")
            .populate("assignedTruckId", "truckNumber truckType capacity")
            .populate("approvedByAdminId", "name email");
        return res.status(200).json({ success: true, requests });
    }
    catch (error) {
        console.error("Error fetching all requests:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getAllRequests = getAllRequests;
const getAcceptedRequests = async (req, res) => {
    try {
        const requests = await requestModel_1.default.find({
            requestStatus: { $in: [statusEnums_1.RequestStatus.Accepted] }
        })
            .populate("customerId", "name email phone")
            .populate("acceptedByTruckOwnerId", "name email phone")
            .populate("acceptedTruckId", "truckNumber truckType capacity")
            .populate("approvedByAdminId", "name email");
        return res.status(200).json({ success: true, requests });
    }
    catch (error) {
        console.error("Error fetching accepted requests:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getAcceptedRequests = getAcceptedRequests;
//Approve a request
const approveRequest = async (req, res) => {
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
        const updatedRequest = await (0, statusService_1.updateRequestStatus)(requestId, statusEnums_1.RequestStatus.Approved, { adminId });
        await updatedRequest.populate("customerId", "name email phone");
        await updatedRequest.populate("acceptedByTruckOwnerId", "name email phone");
        await updatedRequest.populate("acceptedTruckId", "truckNumber truckType capacity");
        const customer = updatedRequest.customerId;
        const truckOwner = updatedRequest.acceptedByTruckOwnerId;
        const truck = updatedRequest.acceptedTruckId;
        // Email notifications
        if (customer?.email) {
            await (0, sendEmail_1.sendEmail)({
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
            await (0, sendEmail_1.sendEmail)({
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
    }
    catch (error) {
        console.error("Error approving request:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.approveRequest = approveRequest;
//Reject a request
const rejectRequest = async (req, res) => {
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
        const updatedRequest = await (0, statusService_1.updateRequestStatus)(requestId, statusEnums_1.RequestStatus.Cancelled, { adminId });
        await updatedRequest.populate("customerId", "name email phone");
        await updatedRequest.populate("acceptedByTruckOwnerId", "name email phone");
        await updatedRequest.populate("acceptedTruckId", "truckNumber truckType capacity");
        // Rollback truck if assigned
        if (updatedRequest.acceptedTruckId) {
            await truckModel_1.default.findByIdAndUpdate(updatedRequest.acceptedTruckId, { status: "available" });
        }
        const customer = updatedRequest.customerId;
        const truckOwner = updatedRequest.acceptedByTruckOwnerId;
        const truck = updatedRequest.acceptedTruckId;
        // Email notifications
        if (customer?.email) {
            await (0, sendEmail_1.sendEmail)({
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
            await (0, sendEmail_1.sendEmail)({
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
    }
    catch (error) {
        console.error("Error rejecting request:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.rejectRequest = rejectRequest;
//Manual Assignment
const manualAssignRequest = async (req, res) => {
    try {
        const adminId = req.user?.id;
        const { requestId, truckId, truckOwnerId } = req.body;
        if (!adminId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        if (!requestId || !truckId)
            return res.status(400).json({ success: false, message: "Request ID and Truck ID required" });
        const request = await requestModel_1.default.findById(requestId);
        if (!request)
            return res.status(404).json({ success: false, message: "Request not found" });
        const truck = await truckModel_1.default.findOne({ _id: truckId, status: "available" });
        if (!truck)
            return res.status(400).json({ success: false, message: "Truck not available" });
        // Assign truck
        request.assignedTruckId = truck._id;
        // Assign truck owner if provided
        if (truckOwnerId) {
            if (mongoose_1.default.Types.ObjectId.isValid(truckOwnerId)) {
                request.acceptedByTruckOwnerId = new mongoose_1.default.Types.ObjectId(truckOwnerId);
            }
            else {
                return res.status(400).json({ success: false, message: "Invalid truckOwnerId" });
            }
        }
        request.requestStatus = statusEnums_1.RequestStatus.Approved;
        request.approvedByAdminId = adminId;
        await request.save();
        // Update truck status
        truck.status = "busy";
        await truck.save();
        // Populate only required fields for frontend
        const populatedRequest = await requestModel_1.default.findById(request._id)
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
        const customer = populatedRequest?.customerId;
        const truckOwner = populatedRequest?.acceptedByTruckOwnerId;
        const assignedTruck = populatedRequest?.assignedTruckId;
        if (customer?.email) {
            await (0, sendEmail_1.sendEmail)({
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
            await (0, sendEmail_1.sendEmail)({
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
    }
    catch (error) {
        console.error("Error in manual assignment:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.manualAssignRequest = manualAssignRequest;
// Delete a request
const deleteRequest = async (req, res) => {
    try {
        const adminId = req.user?.id;
        const requestId = req.params.id;
        if (!adminId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        if (!requestId)
            return res.status(400).json({ success: false, message: "Request ID is required" });
        const request = await requestModel_1.default.findById(requestId);
        if (!request)
            return res.status(404).json({ success: false, message: "Request not found" });
        // Delete the request
        await requestModel_1.default.findByIdAndDelete(requestId);
        // free the assigned truck if any
        if (request.assignedTruckId) {
            await truckModel_1.default.findByIdAndUpdate(request.assignedTruckId, { status: "available" });
        }
        return res.status(200).json({ success: true, message: "Request deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting request:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.deleteRequest = deleteRequest;
//# sourceMappingURL=adminController.js.map