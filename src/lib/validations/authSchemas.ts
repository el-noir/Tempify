import {z} from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10), // From email
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});






