import "server-only";
import { cookies } from "next/headers";
import successfulLogin from "./successful-login";

export async function getSession() {
    return (await cookies()).get("session");
}

export async function createSession(loginRes: any, session: string, refresh: string) {
    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: new Date(loginRes.accessTokenExpires),
        sameSite: "none"
    });
    (await cookies()).set("refresh", refresh, {
        httpOnly: true,
        secure: true,
        expires: new Date(loginRes.refreshTokenExpires),
        sameSite: "none"
    });
    (await cookies()).set("userid", loginRes.userId, {
        httpOnly: true,
        secure: true,
        expires: new Date(loginRes.refreshTokenExpires),
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
    (await cookies()).delete("refresh");
    (await cookies()).delete("userid");
}

export async function refreshSession() {
    const refreshCookie = (await cookies()).get('refresh')?.value;
    const userId = (await cookies()).get('userid')?.value;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/refresh-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            userId: userId,
            refreshToken: refreshCookie
        }),
    });
    // console.log("response ", response)
    return await successfulLogin(response);
}
