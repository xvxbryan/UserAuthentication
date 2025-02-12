import "server-only";
import { cookies } from "next/headers";
import ILoginRes from "../interfaces/ILoginRes";

export async function createSession(loginRes: ILoginRes) {
    (await cookies()).set("session", loginRes.accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(loginRes.expires),
        sameSite: "none"
    });
}