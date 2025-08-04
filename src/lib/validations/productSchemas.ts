import {z} from 'zod'

export const addProductSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(280).optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  imageUrl: z.string().url({ message: "Invalid image URL" }),
  quantityAvailable: z.number().min(1).optional(),
});

export const createCheckoutSchema = z.object({
  productId: z.string().length(24), // MongoDB ObjectId
  quantity: z.number().min(1).max(10),
});