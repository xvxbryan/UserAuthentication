import { createContext, useContext } from "react";
import { UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";

interface FormContextType<T extends FieldValues> {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
}

export const FormContext = createContext<FormContextType<any> | null>(null);

export const useFormContext = <T extends FieldValues>() => {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }

    return context as FormContextType<T>;
};
