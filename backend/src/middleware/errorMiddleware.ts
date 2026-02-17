import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";


export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  logger.error("API Error", {
    message: err.message,
    stack: err.stack,
    statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    params: req.params,
    query: req.query,
    body: req.body,
    user: (req as any).user || null,
  });

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
};