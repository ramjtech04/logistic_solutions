import mongoose, { Document } from "mongoose";
export interface ITruck extends Document {
    truckNumber: string;
    truckType: "open" | "container" | "trailer" | "tanker" | "refrigerated";
    capacity: number;
    state: string;
    city: string;
    status: "available" | "busy" | "maintenance";
    fuelType: "diesel" | "petrol" | "cng" | "electric";
    truckOwnerId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Truck: mongoose.Model<ITruck, {}, {}, {}, mongoose.Document<unknown, {}, ITruck, {}, {}> & ITruck & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Truck;
//# sourceMappingURL=truckModel.d.ts.map