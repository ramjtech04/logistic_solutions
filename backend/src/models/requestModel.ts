import mongoose, { Schema, Document } from "mongoose";
import { RequestStatus, DeliveryStatus } from "../enums/statusEnums";

export interface IRequest extends Document {
  customerId: mongoose.Types.ObjectId;
  pickupState: string;
  pickupCity: string;
  pickupAddress: string;
  dropState: string;
  dropCity: string;
  dropAddress: string;
  loadType: string;
  loadWeight: number;
  requestStatus: RequestStatus;
  deliveryStatus: DeliveryStatus;
  acceptedByTruckOwnerId?: mongoose.Types.ObjectId | null;
  acceptedTruckId?: mongoose.Types.ObjectId | null;
  approvedByAdminId?: mongoose.Types.ObjectId | null;
  assignedTruckId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
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
      enum: Object.values(RequestStatus),
      default: RequestStatus.Pending,
    },
    deliveryStatus: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.NotStarted,
    },

    acceptedByTruckOwnerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    acceptedTruckId: { type: Schema.Types.ObjectId, ref: "Truck", default: null },
    approvedByAdminId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    assignedTruckId: { type: Schema.Types.ObjectId, ref: "Truck", default: null },
  },
  { timestamps: true }
);

// Index for faster queries
requestSchema.index({ pickupState: 1, pickupCity: 1, dropState: 1, dropCity: 1, requestStatus: 1 });

const Request = mongoose.model<IRequest>("Request", requestSchema);
export default Request;
