"use client";

import React, { useActionState, useEffect } from "react";
import IActionResponse from "../interfaces/IActionResponse";
import IRegisterFormData from "../interfaces/IRegisterFormData";
import { useRouter } from "next/navigation";
import { register } from "./actions";
import { RegisterFormData, registerSchema } from "./auth-validation";
import LogRegBackground from "../components/LogRegBackground";
import FormComponent from "../components/FormComponent";
import { StateContext } from "../contexts/stateContext";
import RegisterFields from "./RegisterFields";

const initialState: IActionResponse<IRegisterFormData> = {
    success: false,
    message: "",
};

export function RegisterForm() {
    const router = useRouter();
    const [state, registerAction] = useActionState(register, initialState);

    const initialValues: Partial<RegisterFormData> = {
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
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <FormComponent<RegisterFormData>
                schema={registerSchema}
                values={initialValues}
                formAction={registerAction}
            >
                <StateContext.Provider value={{ state }}>
                    <RegisterFields />
                </StateContext.Provider>
            </FormComponent>
        </LogRegBackground>
    );
};