import mongoose, { Schema, Document } from "mongoose"

export interface StorePlan extends Document {
  title: string
  durationHours: number
  basePrice: number
  discountPercentage?: number
  finalPrice: number
}

const StorePlanSchema: Schema<StorePlan> = new Schema(
  {
    title: { type: String, required: true },
    durationHours: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 }, // ✅ fixed field name
    finalPrice: { type: Number, required: true },
  },
  { timestamps: true }
)

StorePlanSchema.pre("save", function (next) {
  const plan = this as StorePlan
  const discount = plan.discountPercentage ?? 0
  plan.finalPrice = Math.floor(
    plan.basePrice - (plan.basePrice * discount) / 100
  )
  next()
})

const StorePlanModel =
  mongoose.models.StorePlan ||
  mongoose.model<StorePlan>("StorePlan", StorePlanSchema)

export default StorePlanModel
