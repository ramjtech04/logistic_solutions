"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const truckRoutes_1 = __importDefault(require("./routes/truckRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const deliveryRoutes_1 = __importDefault(require("./routes/deliveryRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/roles", roleRoutes_1.default);
app.use("/api/trucks", truckRoutes_1.default);
app.use("/api/requests", requestRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/delivery", deliveryRoutes_1.default);
// Test Route
app.get("/", (req, res) => {
    res.send("Backend is running with TypeScript!");
});
// Error Handler Middleware
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map