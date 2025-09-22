import mongoose, { Schema, Document } from "mongoose";

export interface ITruck extends Document {
  truckNumber: string;
  truckType: "open" | "container" | "trailer" | "tanker" | "refrigerated";
  capacity: number; 
  state: string;
  city: string;
  status: "available" | "busy" | "maintenance";
  fuelType: "diesel" | "petrol" | "cng" | "electric";
  truckOwnerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


const truckSchema = new Schema<ITruck>(
  {
    truckNumber: {
      type: String,
      required: [true, "Truck number is required"],
      unique: true,
      trim: true,
    },
    truckType: {
      type: String,
      required: [true, "Truck type is required"],
      enum: ["open", "container", "trailer", "tanker", "refrigerated"],
    },
    capacity: {
      type: Number,
      required: [true, "Truck capacity (in tons) is required"],
      min: [1, "Capacity must be greater than 0"],
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Truck owner is required"],
    },
  },
  {
    timestamps: true,
  }
);

//Indexing
truckSchema.index({ state: 1, city: 1, status: 1 });

const Truck = mongoose.model<ITruck>("Truck", truckSchema);
export default Truck;
