"use client";

import { useActionState, useEffect } from "react";
import { login } from "./actions";
import LogRegBackground from "../components/LogRegBackground";
import { useRouter } from "next/navigation";
import IActionResponse from "../interfaces/IActionResponse";
import { LoginFormData, loginSchema } from "./auth-validation";
import FormComponent from "../components/FormComponent";
import LoginFields from "./LoginFields";
import ILoginFormData from "../interfaces/ILoginFormData";
import { StateContext } from "../contexts/stateContext";

const initialState: IActionResponse<ILoginFormData> = {
    success: false,
    message: "",
};

export function LoginForm() {
    const router = useRouter();
    const [state, loginAction] = useActionState(login, initialState);

    const initialValues: Partial<LoginFormData> = {
        username: "",
        passwordHash: "",
    };

    useEffect(() => {
        if (state?.success && state.redirectTo) {
            router.push(state.redirectTo);
        }
    }, [state, router]);


    return (
        <LogRegBackground>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <FormComponent<LoginFormData>
                schema={loginSchema}
                values={initialValues}
                formAction={loginAction}
            >
                <StateContext.Provider value={{state}}>
                    <LoginFields/>
                </StateContext.Provider>
            </FormComponent>
        </LogRegBackground>
    );
}