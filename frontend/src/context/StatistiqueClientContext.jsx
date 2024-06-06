import { createContext  , useReducer , useEffect } from "react";

export const StatistiqueClientContext = createContext() 


export const statistiquesClientReducer = (state, action) => {
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

export const StatistiquesClientContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer(statistiquesClientReducer , {
        statistiques :  {
            "totatReparation": {
                "en_attente": 0,
                "en_cours": 0,
                "termine": 0
            },
            "reparationClient" : [],

        }
    })

   

    return(
        <StatistiqueClientContext.Provider value={{...state , dispatch}}>
            {children}
        </StatistiqueClientContext.Provider>
    )
}

