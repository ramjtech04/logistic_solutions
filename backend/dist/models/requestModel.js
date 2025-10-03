"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const statusEnums_1 = require("../enums/statusEnums");
const requestSchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer is required"],
    },
    pickupState: { type: String, required: true, trim: true },
    pickupCity: { type: String, required: true, trim: true },
    pickupAddress: { type: String, required: true, trim: true },
    dropState: { type: String, required: true, trim: true },
    dropCity: { type: String, required: true, trim: true },
    dropAddress: { type: String, required: true, trim: true },
    loadType: { type: String, required: true, trim: true },
    loadWeight: { type: Number, required: true, min: [1, "Load weight must be > 0"] },
    requestStatus: {
        type: String,
        enum: Object.values(statusEnums_1.RequestStatus),
        default: statusEnums_1.RequestStatus.Pending,
    },
    deliveryStatus: {
        type: String,
        enum: Object.values(statusEnums_1.DeliveryStatus),
        default: statusEnums_1.DeliveryStatus.NotStarted,
    },
    acceptedByTruckOwnerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    acceptedTruckId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Truck", default: null },
    approvedByAdminId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    assignedTruckId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Truck", default: null },
}, { timestamps: true });
// Index for faster queries
requestSchema.index({ pickupState: 1, pickupCity: 1, dropState: 1, dropCity: 1, requestStatus: 1 });
const Request = mongoose_1.default.model("Request", requestSchema);
exports.default = Request;
//# sourceMappingURL=requestModel.js.map