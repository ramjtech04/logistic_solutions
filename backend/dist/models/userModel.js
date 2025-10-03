"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Defining Schema 
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only valid Gmail addresses are allowed (no spaces/special chars before @)."]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "truck_owner", "customer"],
        default: "customer",
    },
}, { timestamps: true });
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const user = this;
        if (user.role === "truck_owner") {
            const Truck = (await Promise.resolve().then(() => __importStar(require("./truckModel")))).default;
            await Truck.deleteMany({ truckOwnerId: user._id });
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
userSchema.pre("findOneAndDelete", async function (next) {
    try {
        const query = this.getFilter();
        const user = await this.model.findOne(query);
        if (user?.role === "truck_owner") {
            const Truck = (await Promise.resolve().then(() => __importStar(require("./truckModel")))).default;
            await Truck.deleteMany({ truckOwnerId: user._id });
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
// Creating & exporting model
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map