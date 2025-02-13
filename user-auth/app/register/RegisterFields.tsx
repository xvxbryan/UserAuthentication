import React, { useContext } from "react";
import { StateContext } from "../contexts/stateContext";
import InputComponent from "../components/InputComponent";

const RegisterFields = () => {
    const stateContext = useContext(StateContext);

    if (!stateContext) {
        throw new Error(
            "stateContext must be used within an InputComponent or Fields component"
        );
    }

    const { state } = stateContext;
    return (
        <>
            <InputComponent 
                name="email" 
                placeholder="Email" 
                type="email" 
            />

            <InputComponent name="username" placeholder="Username" />

            <InputComponent
                name="passwordHash"
                placeholder="Password"
                type="password"
            />

            {state?.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}
        </>
    );
};

export default RegisterFields;
