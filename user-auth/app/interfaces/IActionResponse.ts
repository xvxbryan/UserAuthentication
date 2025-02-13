// import LoginFormData from "./ILoginFormData";

import { DefaultValues } from "react-hook-form";

export default interface IActionResponse<T> {
    success: boolean;
    message?: string;
    errors?: {
        [K in keyof DefaultValues<T>]?: string[];
    };
    redirectTo?: string;
    inputs?: DefaultValues<T>;
}