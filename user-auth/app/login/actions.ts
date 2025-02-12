"use server";

import { z } from "zod";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";
import ILoginRes from "../interfaces/ILoginRes";

type LoginErrors = {
    username?: string[];
    passwordHash?: string[];
    general?: string;
};

const loginSchema = z.object({
    username: z.string().nonempty(),
    passwordHash: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
});

export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors as LoginErrors
        };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(result.data),
        });

        if(response.ok) {
            const loginRes: ILoginRes = await response.json();
            await createSession(loginRes);
        } else {
            const errorText = await response.text();
            return { errors: { general: errorText } };
        }
        
    } catch (error) {
        console.log("Error: ", error);
        return { errors: { general: "Unexpected error occured. Please try again." } };
    }

    redirect("/dashboard");
}

export async function logout() {

}