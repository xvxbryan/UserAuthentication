import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, deleteSession, refreshSession } from "./app/lib/session";
import { loggedOutRoutes, protectedRoutes } from "./middleware_routes";

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isLoggedOutRoute = loggedOutRoutes.includes(path);
    const ignoredPaths = ["/favicon.ico", "/_next", "/static"];

    // Ignore unecessary middleware checks
    if (ignoredPaths.some(prefix => path.startsWith(prefix))) {
        return NextResponse.next();
    }

    const sessionCookie = (await cookies()).get('session')?.value;
    const refreshCookie = (await cookies()).get('refresh')?.value;
    const userId = (await cookies()).get('userid')?.value;

    // Session cookie has expired
    // Use refresh token to make new session cookie
    if(refreshCookie && userId && !sessionCookie) {
        const didRefresh = await refreshSession();
        if(!didRefresh) {
            deleteSession();
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    // If a user is accessing a protected route without a cookie that means
    // they are not logged in and should be redirected to do so.
    if (isProtectedRoute && !sessionCookie) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // If a user is accessing a protected route and does have a cookie
    // first decrypt and validate the cookie to verify it is actually a user.
    // If valid user, continue
    // if not, redirect them to log in.
    if(isProtectedRoute && sessionCookie) {
        const session = await decrypt(sessionCookie);
        if (session) {
            return NextResponse.next();
        } else {
            deleteSession();
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    // If a user is accessing a route that is only available to users who
    // are not logged in and they have a cookie, redirect them to the dashboard
    // (The dashboard will check the validity of their cookie since its a protected route)
    if (isLoggedOutRoute && sessionCookie) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}