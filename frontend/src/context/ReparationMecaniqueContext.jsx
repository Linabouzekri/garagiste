import { createContext  , useReducer , useEffect } from "react";

export const ReparationsMecaniqueContext = createContext() 

export const  reparationsMecaniqueReducer = (state , action) =>{
    switch(action.type){
        case 'SET_REPARATIONS' :
            return { reparationsMecanique : action.payload}
        case 'CREATE_REPARATION':
            return  {reparationsMecanique : [action.payload , ...state.reparationsMecanique]}
        case 'UPDATE_REPARATION':

            const updatedReparationMecaniqueIndex = state.reparationsMecanique.findIndex(item => item.id === action.payload.id);
        
            if (updatedReparationMecaniqueIndex !== -1) {
                const updatedReparationMecanique = [...state.reparationsMecanique];
                updatedReparationMecanique[updatedReparationMecaniqueIndex] = action.payload;
                return { reparationsMecanique: updatedReparationMecanique };
            } 
        case 'DELETE_REPARATION':
            const filteredReparationsMecanique = state.reparationsMecanique.filter(item => item.id !== action.payload);
            return { reparationsMecanique: filteredReparationsMecanique };
        default : 
            return state 

    }
}

export const ReparationsMecaniqueContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer(reparationsMecaniqueReducer , {
        reparationsMecanique :  []
    })

   

    return(
        <ReparationsMecaniqueContext.Provider value={{...state , dispatch}}>
            {children}
        </ReparationsMecaniqueContext.Provider>
    )
}

