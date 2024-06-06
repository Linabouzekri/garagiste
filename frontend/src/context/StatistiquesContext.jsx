import { createContext  , useReducer , useEffect } from "react";

export const StatistiquesContext = createContext() 

// export const  statistiquesReducer = (state , action) =>{
//     switch(action.type){
//         case 'SET_STATISTIQUE' :
//             return { statistiques : action.payload}

//         case 'UPDATE_STATISTIQUE':
//             return {
//                 ...state,
//                 [action.payload.attribute]: action.payload.value
//             };
       
//         default : 
//             return state 

//     }
// }

export const statistiquesReducer = (state, action) => {
    switch (action.type) {
      case 'SET_STATISTIQUE':
        return {
          ...state,
          statistiques: {
            ...state.statistiques,
            ...action.payload
          }
        };
      case 'UPDATE_STATISTIQUE':
        return {
          ...state,
          statistiques: {
            ...state.statistiques,
            [action.payload.attribute]: action.payload.value
          }
        };
      default:
        return state;
    }
  };

export const StatistiquesContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer(statistiquesReducer , {
        statistiques :  {
            "nbReparation" : 0 ,
            "nbVehicule" : 0,
            "nbMequanicien" : 0,
            "nbClient" : 0,
            "repartionPerMecanique" : [],
            "reparationPerStatus" : [],
            "reparations_en_cours" : [],
            "reparations_termine" : [],
            "reparations_clients" : []

        }
    })

   

    return(
        <StatistiquesContext.Provider value={{...state , dispatch}}>
            {children}
        </StatistiquesContext.Provider>
    )
}

