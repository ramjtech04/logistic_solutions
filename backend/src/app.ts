import express, { Application, Request, Response } from "express";
import { errorHandler } from './middleware/errorMiddleware';
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes";
import roleRoutes from "./routes/roleRoutes";
import truckRoutes from "./routes/truckRoutes"
dotenv.config();

const app: Application = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/roles",roleRoutes);
app.use("/api/trucks",truckRoutes);
// Test Route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running with TypeScript!");
});


// Error Handler Middleware
app.use(errorHandler);
export default app;
