import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Product extends Document {
    storeId: Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    quantityAvailable?: number;
}

const ProductSchema : Schema<Product> = new Schema(
    {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    quantityAvailable: { type: Number, default: null },
  },
   { timestamps: true }
);

const ProductModel = (mongoose.models.Product as mongoose.Model<Product>) || mongoose.model<Product>('Product', ProductSchema);

export default ProductModel