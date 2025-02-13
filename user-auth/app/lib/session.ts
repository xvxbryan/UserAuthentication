import "server-only";
import { cookies } from "next/headers";
import ILoginRes from "../interfaces/ILoginRes";

export async function getSession() {
    return (await cookies()).get("session");
}

export async function createSession(loginRes: ILoginRes) {
    (await cookies()).set("session", loginRes.accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(loginRes.expires),
        sameSite: "none"
    });
}

export async function decrypt(session: string | undefined = "") {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Auth/dashboard`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session}`
                },
                cache: "no-store",
            }
        );
        if (res.ok) {
            const data = await res.json();
            // console.log("Dashboard Data:", data);
            return true;
        } else {
            deleteSession();
            throw new Error('Unauthorized');
        }
    } catch (error) {
        console.log("Error ", error);
    }
}

export async function deleteSession() {
    (await cookies()).delete("session");
}