import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error("Error:", err.stack || err.message);
    logger.error(err.message, err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};
