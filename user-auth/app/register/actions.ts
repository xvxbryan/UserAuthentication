"use server";

import IActionResponse from "../interfaces/IActionResponse";
import ILoginRes from "../interfaces/ILoginRes";
import IRegisterFormData from "../interfaces/IRegisterFormData";
import { createSession } from "../lib/session";
import successfulLogin from "../lib/successful-login";
import { registerSchema } from "./auth-validation";

export async function register(_: any, formData: FormData): Promise<IActionResponse<IRegisterFormData>> {
    const rawData: IRegisterFormData = {
        username: formData.get("username") as string,
        passwordHash: formData.get("passwordHash") as string,
        email: formData.get("email") as string
    }

    const result = registerSchema.safeParse(rawData);

    if (!result.success) {
        return {
            inputs: rawData,
            success: false,
            errors: result.error.flatten().fieldErrors
        };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/register`, {
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