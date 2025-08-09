import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Commission extends Document {
    orderId: Types.ObjectId;
    storeId: Types.ObjectId;
    storeOwnerId: Types.ObjectId;
    planId: Types.ObjectId;
    grossAmount: number; // Total order amount
    commissionPercentage: number; // Commission percentage from the plan
    commissionAmount: number; // Calculated commission amount
    netAmount: number; // Amount after commission deduction
    stripeTransferId?: string; // Stripe transfer ID for the payout
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    processedAt?: Date;
    failureReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommissionSchema: Schema<Commission> = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        storeId: {
            type: Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
        storeOwnerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'StorePlan',
            required: true,
        },
        grossAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        commissionPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        commissionAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        netAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        stripeTransferId: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        processedAt: {
            type: Date,
        },
        failureReason: {
            type: String,
        },
    },
    { timestamps: true }
);

// Pre-save hook to calculate commission and net amounts
CommissionSchema.pre('save', function (next) {
    const commission = this as Commission;
    
    if (commission.isModified('grossAmount') || commission.isModified('commissionPercentage')) {
        commission.commissionAmount = Math.round(
            (commission.grossAmount * commission.commissionPercentage) / 100
        );
        commission.netAmount = commission.grossAmount - commission.commissionAmount;
    }
    
    next();
});

const CommissionModel =
    mongoose.models.Commission ||
    mongoose.model<Commission>('Commission', CommissionSchema);

export default CommissionModel;
