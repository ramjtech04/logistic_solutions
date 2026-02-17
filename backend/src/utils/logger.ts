import winston from "winston";

const logger = winston.createLogger({
  level: "error", // Only error level
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} [${level}]: ${stack || message}`;
    })
  ),
  transports: [
    // Single error file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Optional: Console (remove if not needed)
    new winston.transports.Console({
      level: "error",
    }),
  ],
  exitOnError: false,
});

// Handle unhandled errors
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection: " + err);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception: " + err);
  process.exit(1);
});

export default logger;
