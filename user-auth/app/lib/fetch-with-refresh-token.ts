import { refreshSession } from "./session";

export default async function fetchWithRefreshToken(url: string, options = {}) {
    let response = await fetch(url, { ...options, credentials: "include" });
    if (response.status === 401) {
        // Try to refresh token
        const didRefresh = await refreshSession();
        if (didRefresh) {
            // Retry original request after successful refresh
            response = await fetch(url, { ...options, credentials: "include" });
        }
    }
    return response;
}