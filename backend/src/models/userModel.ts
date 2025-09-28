import mongoose, { Document, Schema, CallbackError } from "mongoose";

//roles
export type UserRole = "admin" | "truck_owner" | "customer";

// User interface
export interface IUser extends Document {
  name: string;
  email: string;
  phone:string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Defining Schema 
const userSchema = new Schema<IUser>(
  {
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
      index:true,
      match:[/^[a-zA-Z0-9._%+-]+@gmail\.com$/,"Only valid Gmail addresses are allowed (no spaces/special chars before @)."]
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
      select:false
    },
    role: {
      type: String,
      enum: ["admin", "truck_owner", "customer"],
      default: "customer",
    },
  },
  { timestamps: true }
);

userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const user = this as IUser;
    if (user.role === "truck_owner") {
      const Truck = (await import("./truckModel")).default;
      await Truck.deleteMany({ truckOwnerId: user._id });
    }
    next();
  } catch (err: unknown) {
    next(err as CallbackError);
  }
});

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = this.getFilter();
    const user = await this.model.findOne(query) as IUser;
    if (user?.role === "truck_owner") {
      const Truck = (await import("./truckModel")).default;
      await Truck.deleteMany({ truckOwnerId: user._id });
    }
    next();
  } catch (err: unknown) {
    next(err as CallbackError);
  }
});


// Creating & exporting model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
