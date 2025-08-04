import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Order extends Document {
    storeId: Types.ObjectId;
    productId: Types.ObjectId;
    buyerEmail: string;
    buyerName?: string;
    quantity: number;
    totalPrice: number;
    stripeSessionId: string;
    status: 'pending' | 'paid' | 'cancelled' | 'refunded' ;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema<Order> = new Schema (
    {
          storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    buyerEmail: { type: String, required: true, match: /^[\w.-]+@[\w.-]+\.\w{2,}$/ },
    buyerName: { type: String },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    stripeSessionId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled', 'refunded'],
      default: 'pending',
    },
},
    {
        timestamps: true
    }
)

const OrderModel = (mongoose.models.Order as mongoose.Model<Order>) || mongoose.model<Order>('Order', OrderSchema)

export default OrderModel