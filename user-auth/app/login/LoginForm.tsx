"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";
import LogRegBackground from "../components/LogRegBackground";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const router = useRouter();
    const [state, loginAction] = useActionState(login, undefined);

    const [formData, setFormData] = useState({
        username: "",
        passwordHash: "",
    });

    useEffect(() => {
        if (state?.success && state.redirectTo) {
            router.push(state.redirectTo);
        }
    }, [state, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <LogRegBackground>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form
                action={loginAction}
                className="space-y-4 flex flex-col justify-center"
            >
                <div className="flex flex-col gap-2">
                    <input
                        className="w-full p-2 border rounded mt-1"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                {state?.errors?.general && (
                    <p className="text-rose-500">{state.errors.general}</p>
                )}

                {state?.errors?.username && (
                    <p className="text-rose-500">{state.errors.username}</p>
                )}

                <div className="flex flex-col gap-2">
                    <input
                        className="w-full p-2 border rounded mt-1"
                        id="passwordHash"
                        name="passwordHash"
                        type="password"
                        placeholder="Password"
                        value={formData.passwordHash}
                        onChange={handleChange}
                        required
                    />
                </div>
                {state?.errors?.passwordHash && (
                    <p className="text-rose-500">{state.errors.passwordHash}</p>
                )}

                <SubmitButton />
            </form>
        </LogRegBackground>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
            Login
        </button>
    );
}
