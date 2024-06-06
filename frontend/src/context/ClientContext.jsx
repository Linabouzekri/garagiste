import { createContext  , useReducer , useEffect } from "react";

export const ClientsContext = createContext() 

export const  clientsReducer = (state , action) =>{
    switch(action.type){
        case 'SET_CLIENTS' :
            return { clients : action.payload}
        case 'CREATE_CLIENT':
            return  {clients : [action.payload , ...state.clients]}
        case 'UPDATE_CLIENT':

            const updatedClientIndex = state.clients.findIndex(item => item.id === action.payload.id);
        
            if (updatedClientIndex !== -1) {
                const updatedClient = [...state.clients];
                updatedClient[updatedClientIndex] = action.payload;
                return { clients: updatedClient };
            } 
        case 'DELETE_CLIENT':
            const filteredClients = state.clients.filter(item => item.id !== action.payload);
            return { clients: filteredClients };
        default : 
            return state 

    }
}

export const ClientsContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer(clientsReducer , {
        clients :  []
    })

   

    return(
        <ClientsContext.Provider value={{...state , dispatch}}>
            {children}
        </ClientsContext.Provider>
    )
}

