import mongoose from "mongoose";
import { RequestStatus } from "../enums/statusEnums";
export declare const updateRequestStatus: (requestId: string, newStatus: RequestStatus, { truckOwnerId, truckId, adminId, }?: {
    truckOwnerId?: string;
    truckId?: string;
    adminId?: string;
}) => Promise<mongoose.Document<unknown, {}, import("../models/requestModel").IRequest, {}, {}> & import("../models/requestModel").IRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
//# sourceMappingURL=statusService.d.ts.map