import {z} from 'zod'

export const signInSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(1, { message: "Password is required" })
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10), // From email
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const verifySchema = z.object({
    code: z.string().length(6, 'Verification code must be 6 digits')
}) 




