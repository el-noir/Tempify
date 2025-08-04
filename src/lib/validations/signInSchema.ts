import {z} from 'zod'

export const signInSchema = z.object({
    identifier: z.string().email({message: "Invalid email address"}),
    password: z.string().min(1, { message: "Password is required" })
})