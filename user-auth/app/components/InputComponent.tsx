import React, { useContext } from "react";
import { FormContext } from "../contexts/formContext";
import { StateContext } from "../contexts/stateContext";

interface InputProps {
    name: string;
    placeholder: string;
    type?: string;
}

const InputComponent: React.FC<InputProps> = ({ name, placeholder, type }) => {
    const formContext = useContext(FormContext);
    const stateContext = useContext(StateContext);

    if (!formContext) {
        throw new Error("formContext must be used within an InputComponent");
    }

    if (!stateContext) {
        throw new Error(
            "stateContext must be used within an InputComponent or Fields component"
        );
    }

    const { register, errors } = formContext;
    const { state } = stateContext;

    return (
        <>
            <div className="flex flex-col gap-2">
                <input
                    className={
                        errors?.[name]?.message || state?.errors?.[name]
                            ? "w-full p-2 border rounded mt-1 border-red-500"
                            : "w-full p-2 border rounded mt-1"
                    }
                    {...register(name)}
                    placeholder={placeholder}
                    defaultValue={state?.inputs?.[name]}
                    aria-describedby={`${name}-error`}
                    type={type}
                />
            </div>

            {/* CLIENT-SIDE ERROR HANDLING */}
            {errors?.[name]?.message && (
                <p id={`${name}-error`} className="text-sm text-red-500">
                    {(errors?.[name]?.message as string) || ""}
                </p>
            )}

            {/* SERVER-SIDE ERROR HANDLING */}
            {state?.errors?.[name] && (
                <p id={`${name}-error`} className="text-sm text-red-500">
                    {state?.errors?.[name][0]}
                </p>
            )}
        </>
    );
};

export default InputComponent;
