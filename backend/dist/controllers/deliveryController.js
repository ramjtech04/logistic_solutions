"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryStatus = exports.getMyDeliveries = exports.updateDeliveryStatus = void 0;
const requestModel_1 = __importDefault(require("../models/requestModel"));
const truckModel_1 = __importDefault(require("../models/truckModel"));
const mongoose_1 = require("mongoose");
const statusEnums_1 = require("../enums/statusEnums");
/**
 * Update delivery status (Admin or Truck Owner)
 * PATCH /api/delivery/updatestatus/:id
 */
const updateDeliveryStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { status } = req.body;
        const userId = req.user?.id;
        if (!requestId || !mongoose_1.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ success: false, message: "Invalid request ID" });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }
        const request = await requestModel_1.default.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        // Just update the delivery status directly
        request.deliveryStatus = status;
        await request.save();
        if (status === statusEnums_1.DeliveryStatus.Delivered) {
            const truckId = request.assignedTruckId || request.acceptedTruckId;
            if (truckId) {
                await truckModel_1.default.findByIdAndUpdate(truckId, { status: "available" });
            }
        }
        return res.status(200).json({ success: true, request });
    }
    catch (error) {
        console.error("Error updating delivery status:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.updateDeliveryStatus = updateDeliveryStatus;
/**
 * Get deliveries assigned to logged-in Truck Owner
 * GET /api/delivery/my
 */
const getMyDeliveries = async (req, res) => {
    try {
        const truckOwnerId = req.user?.id;
        if (!truckOwnerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const deliveries = await requestModel_1.default.find({
            acceptedByTruckOwnerId: truckOwnerId,
        })
            .populate("customerId", "name email phone")
            .populate("acceptedTruckId", "truckNumber truckType capacity")
            .populate("assignedTruckId", "truckNumber truckType capacity");
        return res.status(200).json({ success: true, deliveries });
    }
    catch (error) {
        console.error("Error fetching deliveries:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getMyDeliveries = getMyDeliveries;
/**
 * Get delivery status (Customer/Admin/TruckOwner)
 * GET /api/delivery/:id
 */
const getDeliveryStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        if (!requestId || !mongoose_1.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ success: false, message: "Invalid request ID" });
        }
        const request = await requestModel_1.default.findById(requestId)
            .populate("customerId", "name email phone")
            .populate("acceptedByTruckOwnerId", "name email phone")
            .populate("acceptedTruckId", "truckNumber truckType capacity")
            .populate("assignedTruckId", "truckNumber truckType capacity");
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        return res.status(200).json({
            success: true,
            deliveryStatus: request.deliveryStatus,
            request,
        });
    }
    catch (error) {
        console.error("Error fetching delivery status:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getDeliveryStatus = getDeliveryStatus;
//# sourceMappingURL=deliveryController.js.map