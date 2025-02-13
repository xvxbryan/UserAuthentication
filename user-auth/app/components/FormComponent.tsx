import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition, useRef } from "react";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { FormContext } from "../contexts/formContext";
import { useFormStatus } from "react-dom";

interface FormProps<T> {
    schema: z.ZodSchema<T>;
    values: Partial<T>;
    formAction: (payload: FormData) => void;
    children: React.ReactNode;
}

const FormComponent = <T extends FieldValues>({
    schema,
    values,
    formAction,
    children,
}: FormProps<T>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: values as DefaultValues<T>,
        mode: "onTouched",
    });

    const formRef = useRef<HTMLFormElement>(null);

    return (
        <FormContext.Provider value={{ register, errors }}>
            <form
                ref={formRef}
                action={formAction}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(() => {
                        startTransition(() =>
                            formAction(new FormData(formRef.current!))
                        );
                    })(e);
                }}
                className="space-y-4 flex flex-col justify-center"
            >
                {children}
                <SubmitButton />
            </form>
        </FormContext.Provider>
    );
};

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

export default FormComponent;
