
import { ClientsContext } from "../context/ClientContext";
import { useContext } from "react";

export const useClientsContext = ()=>{
    const context = useContext(ClientsContext)
    
    if (!context){
        throw Error('useContext must be used inside an ClientsProvider')
    }
    
    return context
}