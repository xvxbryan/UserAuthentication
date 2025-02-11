import "server-only";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import ILoginRes from "../interfaces/ILoginRes";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(loginRes: ILoginRes) {
    (await cookies()).set("session", loginRes.accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(loginRes.expires)
    });
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS512"],
        });
        return payload;
    } catch (error) {
        console.log("Failed to verify session");
    }
}