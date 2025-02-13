import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().nonempty(),
    passwordHash: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
});

export type LoginFormData = z.infer<typeof loginSchema>;