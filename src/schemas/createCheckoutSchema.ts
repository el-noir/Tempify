import {z} from 'zod'

export const createCheckoutSchema = z.object({
  productId: z.string().length(24), // MongoDB ObjectId
  quantity: z.number().min(1).max(10),
});
