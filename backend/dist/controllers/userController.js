"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.updateMe = exports.getMe = exports.getUserById = exports.deleteUser = exports.updateUserByAdmin = exports.getTruckOwners = exports.getCustomers = exports.getAdmins = exports.createUserByAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
//CREATE
// Admin creates user 
const createUserByAdmin = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        // Validate role server-side too
        const allowedRoles = ["admin", "truck_owner", "customer"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
                data: null,
            });
        }
        const userExists = await userModel_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                data: null,
            });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = await userModel_1.default.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role,
        });
        res.status(201).json({
            success: true,
            message: "User created successfully by admin",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.createUserByAdmin = createUserByAdmin;
//READ
// // Get all users (Admin only)
// Get all Admins
const getAdmins = async (req, res) => {
    try {
        const users = await userModel_1.default.find({ role: "admin" }).select("-password");
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
exports.getAdmins = getAdmins;
// Get all Customers
const getCustomers = async (req, res) => {
    try {
        const users = await userModel_1.default.find({ role: "customer" }).select("-password").sort({ _id: -1 });
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
exports.getCustomers = getCustomers;
// Get all Truck Owners
// export const getTruckOwners = async (req: Request, res: Response) => {
//   try {
//     const users = await User.find({ role: "truck_owner" }).select("-password");
//     res.status(200).json({ success: true, data: users });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message || "Server error" });
//   }
// };
const getTruckOwners = async (req, res) => {
    try {
        const owners = await userModel_1.default.aggregate([
            {
                $match: { role: "truck_owner" }, // only truck owners
            },
            {
                $lookup: {
                    from: "trucks", // collection name in MongoDB
                    localField: "_id", // user _id
                    foreignField: "truckOwnerId", // truck's owner ID
                    as: "trucks", // output array
                },
            },
            {
                $addFields: {
                    truckCount: { $size: "$trucks" }, // add truck count
                },
            },
            {
                $project: {
                    password: 0, // hide password field
                    __v: 0, // optional: hide version key
                },
            },
            {
                $sort: { _id: -1 }, // ✅ newest owners first
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Truck owners fetched successfully with all trucks and truck count",
            data: owners,
        });
    }
    catch (error) {
        console.error("Error fetching truck owners:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.getTruckOwners = getTruckOwners;
//UPDATE
// Admin updates another user (including role)
const updateUserByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = { ...req.body };
        // Check if email is being updated and if it's already in use
        if (updates.email) {
            const existing = await userModel_1.default.findOne({ email: updates.email, _id: { $ne: userId } });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use",
                    data: null,
                });
            }
        }
        // If admin sends password update, hash it
        if (updates.password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            updates.password = await bcryptjs_1.default.hash(updates.password, salt);
        }
        const updatedUser = await userModel_1.default.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        res.json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.updateUserByAdmin = updateUserByAdmin;
//DELETE
// Delete user by Admin
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await userModel_1.default.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        res.json({
            success: true,
            message: "User deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.deleteUser = deleteUser;
// Get single user by ID 
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        // Allow self or admin
        if (req.user.role !== "admin" && req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
                data: null,
            });
        }
        res.json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.getUserById = getUserById;
// Get logged-in user profile
const getMe = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        const user = await userModel_1.default.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        res.json({
            success: true,
            message: "Profile fetched successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.getMe = getMe;
// Update logged-in user
const updateMe = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        const updates = req.body;
        const updatedUser = await userModel_1.default.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        res.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.updateMe = updateMe;
// Delete logged-in user
const deleteMe = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        const deletedUser = await userModel_1.default.findByIdAndDelete(req.user.id);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        res.json({
            success: true,
            message: "Your account has been deleted",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.deleteMe = deleteMe;
//# sourceMappingURL=userController.js.map