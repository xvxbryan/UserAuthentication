// import IFormData from "../interfaces/IFormData";
import { createSession } from "./session";

export default async function successfulLogin(response: Response) {
    if (response.ok) {
        const cookieStr = response.headers.get("set-cookie");
        if (cookieStr) {
            const { session, refresh } = extractTokens(cookieStr);
            const loginRes = await response.json();
            if (!session || !refresh) {
                return false;
            }
            await createSession(loginRes, session, refresh);
            return true;
        } else {
            return false;
        }
    } else {
        // const errorText = await response.text();
        return false;
    }
}

function extractTokens(cookieStr: string): { session: string | null; refresh: string | null } {
    const sessionMatch = cookieStr.match(/session=([^;]+)/);
    const refreshMatch = cookieStr.match(/refresh=([^;]+)/);

    return {
        session: sessionMatch ? sessionMatch[1] : null,
        refresh: refreshMatch ? refreshMatch[1] : null,
    };
}