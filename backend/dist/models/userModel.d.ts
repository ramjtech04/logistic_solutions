import mongoose, { Document } from "mongoose";
export type UserRole = "admin" | "truck_owner" | "customer";
export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=userModel.d.ts.map