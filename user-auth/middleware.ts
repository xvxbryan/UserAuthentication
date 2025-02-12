import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, deleteSession } from "./app/lib/session";
import { loggedOutRoutes, protectedRoutes } from "./middleware_routes";

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isLoggedOutRoute = loggedOutRoutes.includes(path);
    const ignoredPaths = ["/favicon.ico", "/_next", "/static"];

    if (ignoredPaths.some(prefix => path.startsWith(prefix))) {
        return NextResponse.next();
    }

    const cookie = (await cookies()).get('session')?.value;

    if (isProtectedRoute && !cookie) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if(isProtectedRoute && cookie) {
        const session = await decrypt(cookie);
        if (session) {
            return NextResponse.next();
        } else {
            deleteSession();
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    if (isLoggedOutRoute && cookie) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}