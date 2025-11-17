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
const truckSchema = new mongoose_1.Schema({
    truckNumber: {
        type: String,
        required: [true, "Truck number is required"],
        unique: true,
        trim: true,
    },
    truckType: {
        type: String,
        required: [true, "Truck type is required"],
        enum: ["open", "container", "trailer", "tanker", "refrigerated", "Heavy Commerical", "Medium Commerical", "Light Commerical"],
    },
    capacity: {
        type: String,
        required: [true, "Truck capacity (in tons) is required"],
        trim: true,
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["available", "busy", "maintenance"],
        default: "available",
    },
    fuelType: {
        type: String,
        required: [true, "Fuel type is required"],
        enum: ["diesel", "petrol", "cng", "electric"],
    },
    truckOwnerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Truck owner is required"],
    },
}, {
    timestamps: true,
});
//Indexing
truckSchema.index({ state: 1, city: 1, status: 1 });
const Truck = mongoose_1.default.model("Truck", truckSchema);
exports.default = Truck;
//# sourceMappingURL=truckModel.js.map