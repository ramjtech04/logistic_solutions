"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    logger_1.default.error("API Error", {
        message: err.message,
        stack: err.stack,
        statusCode,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        params: req.params,
        query: req.query,
        body: req.body,
        user: req.user || null,
    });
    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map