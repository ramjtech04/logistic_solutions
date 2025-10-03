import mongoose, { Document } from "mongoose";
import { RequestStatus, DeliveryStatus } from "../enums/statusEnums";
export interface IRequest extends Document {
    customerId: mongoose.Types.ObjectId;
    pickupState: string;
    pickupCity: string;
    pickupAddress: string;
    dropState: string;
    dropCity: string;
    dropAddress: string;
    loadType: string;
    loadWeight: number;
    requestStatus: RequestStatus;
    deliveryStatus: DeliveryStatus;
    acceptedByTruckOwnerId?: mongoose.Types.ObjectId | null;
    acceptedTruckId?: mongoose.Types.ObjectId | null;
    approvedByAdminId?: mongoose.Types.ObjectId | null;
    assignedTruckId?: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}
declare const Request: mongoose.Model<IRequest, {}, {}, {}, mongoose.Document<unknown, {}, IRequest, {}, {}> & IRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Request;
//# sourceMappingURL=requestModel.d.ts.map