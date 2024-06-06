import { StatistiquesContext } from "../context/StatistiquesContext";
import { useContext } from "react";

export const useStatistiquesContext = () =>{
    const context = useContext(StatistiquesContext)
    
    if (!context){
        throw Error('useContext must be used inside an StatistiqueContextProvider')
    }
    
    return context
}