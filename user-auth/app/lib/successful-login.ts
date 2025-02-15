import IFormData from "../interfaces/IFormData";
import { createSession } from "./session";

export default async function successfulLogin(response: Response, rawData: IFormData) {
    if (response.ok) {
        const getCookie = response.headers.get("set-cookie")?.split("=")[1];
        const trimCookie = getCookie?.split(";")[0];
        const loginRes = await response.json();
        if (!trimCookie) {
            return { success: false, message: "Unexpected error occured. Please try again.", inputs: rawData, }
        }
        await createSession(loginRes, trimCookie);
        return { success: true, inputs: rawData, redirectTo: "/dashboard" };
    } else {
        const errorText = await response.text();
        return { success: false, message: errorText, inputs: rawData, }
    }
}