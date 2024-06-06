
import { ReparationsContext } from "../context/ReparationContext";
import { useContext } from "react";

export const useReparationsContext = ()=>{
    const context = useContext(ReparationsContext)
    
    if (!context){
        throw Error('useContext must be used inside an ReparationProvider')
    }
    
    return context
}