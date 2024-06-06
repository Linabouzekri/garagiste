import { createContext  , useReducer , useEffect } from "react";

export const VehiculesContext = createContext() 

export const  VehiculesReducer = (state , action) =>{
    switch(action.type){
        case 'SET_VEHICULES' :
            return { vehicules : action.payload}
        case 'CREATE_VEHICULE':
            return  {vehicules : [action.payload , ...state.vehicules]}
        case 'UPDATE_VEHICULE':

            const updatedVehiculeIndex = state.vehicules.findIndex(item => item.id === action.payload.id);
        
            if (updatedVehiculeIndex !== -1) {
                const updatedVehicules = [...state.vehicules];
                updatedVehicules[updatedVehiculeIndex] = action.payload;
                return { vehicules: updatedVehicules };
            }
             
        case 'DELETE_VEHICULE':
            const filteredVehicules = state.vehicules.filter(item => item.id !== action.payload);
            return { vehicules: filteredVehicules };
        default : 
            return state 

    }
}

export const VehiculesContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer(VehiculesReducer , {
        vehicules :  []
    })



    return(
        <VehiculesContext.Provider value={{...state , dispatch}}>
            {children}
        </VehiculesContext.Provider>
    )
}

