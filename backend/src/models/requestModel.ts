import mongoose, { Schema, Document } from "mongoose";

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
  requestStatus: "Pending" | "Accepted" | "Approved" | "Cancelled";
  deliveryStatus: "Not Started" | "In Transit" | "Delivered" | "Failed";
  acceptedByTruckOwnerId?: mongoose.Types.ObjectId;
  acceptedTruckId?: mongoose.Types.ObjectId;
  approvedByAdminId?: mongoose.Types.ObjectId;
  assignedTruckId?: mongoose.Types.ObjectId;
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

    pickupState: {
      type: String,
      required: [true, "Pickup state is required"],
      trim: true,
    },
    pickupCity: {
      type: String,
      required: [true, "Pickup city is required"],
      trim: true,
    },
    pickupAddress: {
      type: String,
      required: [true, "Pickup address is required"],
      trim: true,
    },

    dropState: {
      type: String,
      required: [true, "Drop state is required"],
      trim: true,
    },
    dropCity: {
      type: String,
      required: [true, "Drop city is required"],
      trim: true,
    },
    dropAddress: {
      type: String,
      required: [true, "Drop address is required"],
      trim: true,
    },

    loadType: {
      type: String,
      required: [true, "Load type is required"],
      trim: true,
    },
    loadWeight: {
      type: Number,
      required: [true, "Load weight is required"],
      min: [1, "Load weight must be greater than 0"],
    },

    requestStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Approved", "Cancelled"],
      default: "Pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["Not Started", "In Transit", "Delivered", "Failed"],
      default: "Not Started",
    },

    acceptedByTruckOwnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    acceptedTruckId: {
      type: Schema.Types.ObjectId,
      ref: "Truck",
    },

    approvedByAdminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTruckId: {
      type: Schema.Types.ObjectId,
      ref: "Truck",
    },
  },
  {
    timestamps: true,
  }
);


requestSchema.index({ pickupState: 1, pickupCity: 1, dropState: 1, dropCity: 1, requestStatus: 1 });

const Request = mongoose.model<IRequest>("Request", requestSchema);
export default Request;
