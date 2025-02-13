import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().nonempty(),
    passwordHash: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
    email: z.string().email()
});

export type RegisterFormData = z.infer<typeof registerSchema>;