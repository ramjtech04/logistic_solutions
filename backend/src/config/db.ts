import mongoose from "mongoose";
import logger from "../utils/logger";
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (error: any) {
    logger.error("MongoDB connection failed:", error.message);
    process.exit(1); // Stop the server if DB fails
  }
};

export default connectDB;
