import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
// Middleware

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes

// Test Route

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running with TypeScript!");
});


// Error Handler Middleware

export default app;
