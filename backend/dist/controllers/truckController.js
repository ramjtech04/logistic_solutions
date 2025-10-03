"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrucksByOwner = exports.deleteTruck = exports.updateTruck = exports.getTruckById = exports.getTrucks = exports.addTruck = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const truckModel_1 = __importDefault(require("../models/truckModel"));
// ADD TRUCK
const addTruck = async (req, res) => {
    try {
        const { truckNumber, truckType, capacity, state, city, fuelType, truckOwnerId } = req.body;
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        let ownerIdToUse;
        if (req.user.role === "admin") {
            if (!truckOwnerId) {
                return res.status(400).json({ success: false, message: "truckOwnerId is required for admin", data: null });
            }
            ownerIdToUse = truckOwnerId;
        }
        else {
            ownerIdToUse = req.user.id;
        }
        // Check if truckNumber already exists
        const existingTruck = await truckModel_1.default.findOne({ truckNumber });
        if (existingTruck) {
            return res.status(400).json({ success: false, message: "Truck number already exists", data: null });
        }
        const truck = await truckModel_1.default.create({
            truckNumber,
            truckType,
            capacity,
            state,
            city,
            fuelType,
            truckOwnerId: ownerIdToUse,
        });
        res.status(201).json({ success: true, message: "Truck added successfully", data: truck });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error", data: null });
    }
};
exports.addTruck = addTruck;
// GET ALL TRUCKS
const getTrucks = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const { truckOwnerId, status, state, city } = req.query;
        const filters = {};
        // Truck owner can only see their own trucks
        if (req.user.role === "truck_owner") {
            filters.truckOwnerId = req.user.id;
        }
        else if (truckOwnerId) {
            filters.truckOwnerId = new mongoose_1.default.Types.ObjectId(truckOwnerId);
        }
        if (status)
            filters.status = status;
        if (state)
            filters.state = state;
        if (city)
            filters.city = city;
        const trucks = await truckModel_1.default.find(filters);
        res.status(200).json({ success: true, message: "Trucks fetched successfully", data: trucks });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error", data: null });
    }
};
exports.getTrucks = getTrucks;
// GET TRUCK BY ID
const getTruckById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const truck = await truckModel_1.default.findById(req.params.id);
        if (!truck) {
            return res.status(404).json({ success: false, message: "Truck not found", data: null });
        }
        // Truck owner can only access their own truck
        if (req.user.role === "truck_owner" && truck.truckOwnerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: Not your truck", data: null });
        }
        res.status(200).json({ success: true, message: "Truck fetched successfully", data: truck });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error", data: null });
    }
};
exports.getTruckById = getTruckById;
// UPDATE TRUCK
const updateTruck = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const truck = await truckModel_1.default.findById(req.params.id);
        if (!truck)
            return res.status(404).json({ success: false, message: "Truck not found", data: null });
        // Truck owner can only update their own truck
        if (req.user.role === "truck_owner" && truck.truckOwnerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: Not your truck", data: null });
        }
        const updatedTruck = await truckModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, message: "Truck updated successfully", data: updatedTruck });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error", data: null });
    }
};
exports.updateTruck = updateTruck;
// DELETE TRUCK
const deleteTruck = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const truck = await truckModel_1.default.findById(req.params.id);
        if (!truck)
            return res.status(404).json({ success: false, message: "Truck not found", data: null });
        // Truck owner can only delete their own truck
        if (req.user.role === "truck_owner" && truck.truckOwnerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: Not your truck", data: null });
        }
        await truck.deleteOne();
        res.status(200).json({ success: true, message: "Truck deleted successfully", data: null });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error", data: null });
    }
};
exports.deleteTruck = deleteTruck;
// GET TRUCKS OF SPECIFIC TRUCK OWNER
const getTrucksByOwner = async (req, res) => {
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
        const trucks = await truckModel_1.default.find({ truckOwnerId }).select("truckNumber truckType capacity fuelType city state status");
        res.status(200).json({ success: true, message: "Trucks fetched successfully", data: trucks });
    }
    catch (error) {
        console.error("Error fetching trucks by owner:", error.message);
        res.status(500).json({ success: false, message: error.message || "Server error", data: null });
    }
};
exports.getTrucksByOwner = getTrucksByOwner;
//# sourceMappingURL=truckController.js.map