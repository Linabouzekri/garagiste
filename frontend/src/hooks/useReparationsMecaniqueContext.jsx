import { ReparationsMecaniqueContext } from "../context/ReparationMecaniqueContext";
import { useContext } from "react";

export const useReparationsMecaniqueContext = ()=>{
    const context = useContext(ReparationsMecaniqueContext)
    
    if (!context){
        throw Error('useContext must be used inside an ReparationMecaniqueProvider')
    }
    
    return context
}