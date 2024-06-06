import { ReparationsTermineContext } from "../context/ReparationsTermineContext";
import { useContext } from "react";

export const useReparationsTermineContext = () => {
    const context = useContext(ReparationsTermineContext);

    if (!context) {
        throw new Error('useReparationsTermineContext must be used inside a ReparationsTermineContextProvider');
    }

    return context;
};
