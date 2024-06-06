import { createContext  , useReducer , useEffect } from "react";

export const ReparationsTermineContext = createContext() 

export const   reparationsTermineReducer = (state , action) =>{
    switch(action.type){
        case 'SET_REPARATIONS' :
            return { reparations : action.payload}
        case 'CREATE_REPARATION':
            return  {reparations : [action.payload , ...state.reparations]}
        case 'UPDATE_REPARATION':

            const updatedReparationIndex = state.reparations.findIndex(item => item.id === action.payload.id);
        
            if (updatedReparationIndex !== -1) {
                const updatedReparation = [...state.reparations];
                updatedReparation[updatedReparationIndex] = action.payload;
                return { reparations: updatedReparation };
            } 
        case 'DELETE_REPARATION':
            const filteredReparations = state.reparations.filter(item => item.id !== action.payload);
            return { reparations: filteredReparations };
        default : 
            return state 

    }
}

export const  ReparationsTermineContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer( reparationsTermineReducer , {
        reparations :  []
    })

   

    return(
        <ReparationsTermineContext.Provider value={{...state , dispatch}}>
            {children}
        </ReparationsTermineContext.Provider>
    )
}

