"use client";

import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <Link href="/" className="text-lg font-bold">
                Home
            </Link>

            <div className="flex space-x-4">
                <Link href="/login" className="hover:underline">
                    Login
                </Link>
                <Link href="/register" className="hover:underline">
                    Register
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
