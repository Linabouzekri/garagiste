import { createContext  , useReducer , useEffect } from "react";

export const StatistiqueMecanicienContext = createContext() 


export const statistiquesMecanicienReducer = (state, action) => {
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

export const StatistiquesMecanicienContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer(statistiquesMecanicienReducer , {
        statistiques :  {
            "totatReparation": {
                "en_cours": 0,
                "termine": 0
            },
            "reparationMecanicien" : [],

        }
    })

   

    return(
        <StatistiqueMecanicienContext.Provider value={{...state , dispatch}}>
            {children}
        </StatistiqueMecanicienContext.Provider>
    )
}

