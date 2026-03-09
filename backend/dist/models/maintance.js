"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const expenseSchema = new mongoose_1.default.Schema({
    expense: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});
const maintenanceSchema = new mongoose_1.default.Schema({
    vehicle: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Truck",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    expenses: [expenseSchema], // multiple expenses
    softDeletedByAdmin: { type: Boolean, default: false },
    softDeletedByTruckOwner: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Maintenance", maintenanceSchema);
//# sourceMappingURL=maintance.js.map