export const createStoreSchema = z.object({
  name: z.string().min(3, "Store name is too short").max(50),
  description: z.string().max(280).optional(),
  expiresInHours: z.number().min(1).max(168).optional(), // Max 7 days
});
