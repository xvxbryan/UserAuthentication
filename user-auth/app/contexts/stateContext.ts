import { createContext, useContext } from "react";
import IActionResponse from "../interfaces/IActionResponse";

interface StateContextType<T> {
    state: IActionResponse<T>;
}

export const StateContext = createContext<StateContextType<any> | null>(null);

export const useStateContext = <T>() => {
    const context = useContext(StateContext);

    if (!context) {
        throw new Error("useStateContext must be used within a StateProvider");
    }

    return context as StateContextType<T>;
};
