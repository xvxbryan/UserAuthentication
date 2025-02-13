import Link from "next/link";
import { getSession } from "../lib/session";

const Navbar = async () => {
    const cookies = await getSession();
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <Link href="/" className="text-lg font-bold">
                Home
            </Link>

            <div className="flex space-x-4">
                {!cookies ? (
                    <>
                        <Link href="/login" className="hover:underline">
                            Login
                        </Link>
                        <Link href="/register" className="hover:underline">
                            Register
                        </Link>
                    </>
                ) : (
                    <Link href="/logout" className="hover:underline">
                        Logout
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
