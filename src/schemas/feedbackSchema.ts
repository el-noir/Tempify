import {z} from 'zod'

export const feedbackSchema = z.object({
  message: z.string().min(10, "Message too short"),
  email: z.string().email().optional(),
});
