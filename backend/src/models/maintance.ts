import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  expense: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export default mongoose.model("Maintenance", maintenanceSchema);