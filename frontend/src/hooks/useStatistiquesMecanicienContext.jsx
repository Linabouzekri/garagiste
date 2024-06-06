import { StatistiqueMecanicienContext } from "../context/StatistiqueMecanicienContext";
import { useContext } from "react";

export const useStatistiquesMecanicienContext = () =>{
    const context = useContext(StatistiqueMecanicienContext)
    
    if (!context){
        throw Error('useContext must be used inside an StatistiqueMecanicienContextProvider')
    }
    
    return context
}