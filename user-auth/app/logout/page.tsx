"use client";
import { useEffect } from "react";
import { logout } from "./actions";
import { useRouter } from "next/navigation";

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        const signout = async () => {
            await logout();
            router.push("/");
        };
        signout();
    }, [router]);

    return null;
};

export default Logout;
