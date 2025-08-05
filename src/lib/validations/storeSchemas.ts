import {z} from 'zod'

export const createStoreSchema = z.object({
  name: z.string().min(3, "Store name is too short").max(50),
  description: z.string().max(280).optional(),
  expiresInHours: z.number().min(1).max(168).optional(), // Max 7 days
  planId: z.string().min(1, "Store plan is required"),
});

export const titleValidation = z.string()
                                .min(3, "Store name is too short")
                                .max(50)
                                .regex(/^[a-zA-Z0-9_]+$/, "Name must not contain special character")

export const feedbackSchema = z.object({
  message: z.string().min(10, "Message too short"),
  email: z.string().email().optional(),
});

export const storeDesignSchema = z.object({
  theme: z.enum(["light", "dark", "colorful"]),
  customBannerUrl: z.string().url().optional(),
  featuredProductIds: z.array(z.string().length(24)).optional(),
});

export const updateSchema = z.object({
  name: z.string().min(3, "Store name is too short").max(50),
  description: z.string().max(280).optional(),
})