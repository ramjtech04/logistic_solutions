import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User,{ IUser } from "../models/userModel";

//CREATE
// Admin creates user 
export const createUserByAdmin = async (req: Request, res: Response) => {
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

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

//READ
// // Get all users (Admin only)
// Get all Admins
export const getAdmins = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "admin" }).select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// Get all Customers
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password").sort({ _id: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// Get all Truck Owners
// export const getTruckOwners = async (req: Request, res: Response) => {
//   try {
//     const users = await User.find({ role: "truck_owner" }).select("-password");
//     res.status(200).json({ success: true, data: users });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message || "Server error" });
//   }
// };
export const getTruckOwners = async (req: Request, res: Response) => {
  try {
    const owners = await User.aggregate([
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
  } catch (error: any) {
    console.error("Error fetching truck owners:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

//UPDATE
// Admin updates another user (including role)
export const updateUserByAdmin = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updates: Partial<IUser> = { ...req.body };
      // Check if email is being updated and if it's already in use
    if (updates.email) {
      const existing = await User.findOne({ email: updates.email, _id: { $ne: userId } });
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
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

//DELETE
// Delete user by Admin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

// Get single user by ID 
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized", data: null });
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

// Get logged-in user profile
export const getMe = async (req: Request, res: Response) => {
   
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    
    const user = await User.findById(req.user.id).select("-password");

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

// Update logged-in user
export const updateMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized", data: null });

    const updates: Partial<IUser> = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

// Delete logged-in user
export const deleteMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized", data: null });

    const deletedUser = await User.findByIdAndDelete(req.user.id);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};