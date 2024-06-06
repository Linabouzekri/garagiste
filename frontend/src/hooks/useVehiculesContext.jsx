 
import { VehiculesContext } from "../context/VehiculeContext";
import { useContext } from "react";

export const useVehiculesContext = () =>{
    const context = useContext(VehiculesContext)
    
    if (!context){
        throw Error('useContext must be used inside an VehiculesContextProvider')
    }
    
    return context
}