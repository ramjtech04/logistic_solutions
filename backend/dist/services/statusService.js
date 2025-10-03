"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const requestModel_1 = __importDefault(require("../models/requestModel"));
const statusRules_1 = require("./statusRules");
const statusEnums_1 = require("../enums/statusEnums");
const updateRequestStatus = async (requestId, newStatus, { truckOwnerId, truckId, adminId, } = {}) => {
    const request = await requestModel_1.default.findById(requestId);
    if (!request)
        throw new Error("Request not found");
    const allowed = statusRules_1.requestTransitions[request.requestStatus];
    if (!allowed.includes(newStatus)) {
        throw new Error(`Invalid transition from ${request.requestStatus} → ${newStatus}`);
    }
    request.requestStatus = newStatus;
    if (newStatus === statusEnums_1.RequestStatus.Accepted) {
        if (!truckOwnerId || !truckId)
            throw new Error("Truck owner ID and Truck ID required");
        request.acceptedByTruckOwnerId = new mongoose_1.default.Types.ObjectId(truckOwnerId);
        request.acceptedTruckId = new mongoose_1.default.Types.ObjectId(truckId);
    }
    if (newStatus === statusEnums_1.RequestStatus.Approved) {
        if (!adminId)
            throw new Error("Admin ID required to approve request");
        request.approvedByAdminId = new mongoose_1.default.Types.ObjectId(adminId);
    }
    await request.save();
    return request;
};
exports.updateRequestStatus = updateRequestStatus;
//# sourceMappingURL=statusService.js.map