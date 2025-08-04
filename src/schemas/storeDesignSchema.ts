import {z} from 'zod'

export const storeDesignSchema = z.object({
  theme: z.enum(["light", "dark", "colorful"]),
  customBannerUrl: z.string().url().optional(),
  featuredProductIds: z.array(z.string().length(24)).optional(),
});
