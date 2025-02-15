"use server";

import { createSession } from "../lib/session";
import ILoginRes from "../interfaces/ILoginRes";
import IActionResponse from "../interfaces/IActionResponse";
import ILoginFormData from "../interfaces/ILoginFormData";
import { loginSchema } from "./auth-validation";
import successfulLogin from "../lib/successful-login";

export async function login(_: any, formData: FormData): Promise<IActionResponse<ILoginFormData>> {
    const rawData: ILoginFormData = {
        username: formData.get("username") as string,
        passwordHash: formData.get("passwordHash") as string
    }

    const result = loginSchema.safeParse(rawData);

    if (!result.success) {
        return {
            inputs: rawData,
            success: false,
            errors: result.error.flatten().fieldErrors
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

        return await successfulLogin(response, rawData);
    } catch (error) {
        console.log("Error: ", error);
        return { success: false, message: "Unexpected error occured. Please try again.", inputs: rawData, }
    }
}