import mongoose, {Schema, Document, Types} from 'mongoose'

export interface Store extends Document {
    ownerId: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    products: Types.ObjectId[];
    expiresAt: Date;
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    extendedHours?: number
}

const StoreSchema: Schema<Store>  = new Schema(
    {
        ownerId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        name: {type: String, required: true, trim: true},
        slug: {type: String, required: true, unique: true, lowercase: true},
        description: {type: String, trim: true},
        products: [{type: Schema.Types.ObjectId, ref: "Product"}],
        expiresAt: {type: Date, required: true},
        isActive: {type: Boolean, default: true},
        extendedHours: {type: Number, default: 0},
    }, {timestamps: true}
);

const StoreModel = (mongoose.models.Store as mongoose.Model<Store>) || mongoose.model<Store>('Store', StoreSchema);

export default StoreModel;