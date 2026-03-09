import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    vehicle: mongoose.Types.ObjectId;
    expenses: mongoose.Types.DocumentArray<{
        expense: string;
        amount: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        expense: string;
        amount: number;
    }> & {
        expense: string;
        amount: number;
    }>;
    softDeletedByAdmin: boolean;
    softDeletedByTruckOwner: boolean;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    vehicle: mongoose.Types.ObjectId;
    expenses: mongoose.Types.DocumentArray<{
        expense: string;
        amount: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        expense: string;
        amount: number;
    }> & {
        expense: string;
        amount: number;
    }>;
    softDeletedByAdmin: boolean;
    softDeletedByTruckOwner: boolean;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    vehicle: mongoose.Types.ObjectId;
    expenses: mongoose.Types.DocumentArray<{
        expense: string;
        amount: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        expense: string;
        amount: number;
    }> & {
        expense: string;
        amount: number;
    }>;
    softDeletedByAdmin: boolean;
    softDeletedByTruckOwner: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    vehicle: mongoose.Types.ObjectId;
    expenses: mongoose.Types.DocumentArray<{
        expense: string;
        amount: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        expense: string;
        amount: number;
    }> & {
        expense: string;
        amount: number;
    }>;
    softDeletedByAdmin: boolean;
    softDeletedByTruckOwner: boolean;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    vehicle: mongoose.Types.ObjectId;
    expenses: mongoose.Types.DocumentArray<{
        expense: string;
        amount: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        expense: string;
        amount: number;
    }> & {
        expense: string;
        amount: number;
    }>;
    softDeletedByAdmin: boolean;
    softDeletedByTruckOwner: boolean;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    vehicle: mongoose.Types.ObjectId;
    expenses: mongoose.Types.DocumentArray<{
        expense: string;
        amount: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        expense: string;
        amount: number;
    }> & {
        expense: string;
        amount: number;
    }>;
    softDeletedByAdmin: boolean;
    softDeletedByTruckOwner: boolean;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=maintance.d.ts.map