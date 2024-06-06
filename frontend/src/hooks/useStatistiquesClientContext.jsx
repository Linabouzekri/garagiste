import { StatistiqueClientContext } from "../context/StatistiqueClientContext";
import { useContext } from "react";

export const useStatistiquesClientContext = () =>{
    const context = useContext(StatistiqueClientContext)
    
    if (!context){
        throw Error('useContext must be used inside an StatistiqueClientContextProvider')
    }
    
    return context
}