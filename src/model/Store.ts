import mongoose, { Schema, Document, Types } from 'mongoose'

export interface Store extends Document {
  ownerId: Types.ObjectId
  planId: Types.ObjectId
  name: string
  slug: string
  description?: string
  products: Types.ObjectId[]
  isActive: boolean
  extendedHours?: number
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const StoreSchema: Schema<Store> = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'StorePlan',
      required: true, // ✅ fixed typo
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    extendedHours: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)

StoreSchema.virtual('calculatedExpiresAt').get(function (this: Store) {
  if (!this.populated('planId')) return null
  const plan: any = this.get('planId')
  const totalHours = plan.durationHours + (this.extendedHours || 0)
  return new Date(this.createdAt.getTime() + totalHours * 60 * 60 * 1000)
})

const StoreModel =
  mongoose.models.Store || mongoose.model<Store>('Store', StoreSchema)

export default StoreModel
