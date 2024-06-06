import { ReparationsEnCoursContext } from "../context/ReparationEnCoursContext";
import { useContext } from "react";

export const useReparationsEnCoursContext = ()=>{
    const context = useContext(ReparationsEnCoursContext)
    
    if (!context){
        throw Error('useContext must be used inside an ReparationsEnCoursContextProvider')
    }
    
    return context
}