import {z} from 'zod'

export const updateProductSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.number().min(0).optional(),
  imageUrl: z.string().url().optional(),
  quantityAvailable: z.number().min(0).optional()
});
