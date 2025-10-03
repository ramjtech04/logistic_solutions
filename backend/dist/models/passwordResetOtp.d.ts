import { Document, Types } from "mongoose";
export interface IPasswordResetOTP extends Document {
    userId: Types.ObjectId;
    otpHash: string;
    expiresAt: Date;
    used: boolean;
    attempts: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: import("mongoose").Model<IPasswordResetOTP, {}, {}, {}, Document<unknown, {}, IPasswordResetOTP, {}, {}> & IPasswordResetOTP & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=passwordResetOtp.d.ts.map