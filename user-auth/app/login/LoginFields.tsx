import React, { useContext } from "react";
import InputComponent from "../components/InputComponent";
import { StateContext } from "../contexts/stateContext";

const LoginFields = () => {
    const stateContext = useContext(StateContext);

    if (!stateContext) {
        throw new Error(
            "stateContext must be used within an InputComponent or Fields component"
        );
    }

    const { state } = stateContext;
    return (
        <>
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

export default LoginFields;
