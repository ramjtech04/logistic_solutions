"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: "error", // Only error level
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level}]: ${stack || message}`;
    })),
    transports: [
        // Single error file
        new winston_1.default.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        // Optional: Console (remove if not needed)
        new winston_1.default.transports.Console({
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
exports.default = logger;
//# sourceMappingURL=logger.js.map