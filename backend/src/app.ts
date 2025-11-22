import express, { Application, Request, Response } from "express";
import { errorHandler } from './middleware/errorMiddleware';
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes";
import roleRoutes from "./routes/roleRoutes";
import truckRoutes from "./routes/truckRoutes";
import requestRoutes from "./routes/requestRoutes";
import adminRoutes from "./routes/adminRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
dotenv.config();

const app: Application = express();
// Middleware
app.use(cors(
 {
  origin: "*",
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}
));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/roles",roleRoutes);
app.use("/api/trucks",truckRoutes);
app.use("/api/requests",requestRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/delivery",deliveryRoutes);
// Test Route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running with TypeScript!");
});


// Error Handler Middleware
app.use(errorHandler);
export default app;
