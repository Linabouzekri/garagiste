import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ClientsContextProvider } from './context/ClientContext.jsx'
import { VehiculesContextProvider } from './context/VehiculeContext.jsx'
import { ReparationsContextProvider } from './context/ReparationContext.jsx'
import { ReparationsMecaniqueContextProvider } from './context/ReparationMecaniqueContext.jsx'
import { ReparationsEnCoursContextProvider } from './context/ReparationEnCoursContext.jsx'
import { ReparationsTermineContextProvider } from './context/ReparationsTermineContext.jsx'
import { StatistiquesContextProvider } from './context/StatistiquesContext.jsx'
import { StatistiquesClientContextProvider } from './context/StatistiqueClientContext.jsx'
import { StatistiquesMecanicienContextProvider } from './context/StatistiqueMecanicienContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <VehiculesContextProvider>
      <ClientsContextProvider>
        <AuthContextProvider>
          <ReparationsContextProvider>
            <ReparationsMecaniqueContextProvider>
              <ReparationsEnCoursContextProvider>
                <ReparationsTermineContextProvider>
                  <StatistiquesContextProvider>
                    <StatistiquesClientContextProvider>
                      <StatistiquesMecanicienContextProvider>
                        <App />
                      </StatistiquesMecanicienContextProvider>
                    </StatistiquesClientContextProvider>
                  </StatistiquesContextProvider>
                </ReparationsTermineContextProvider>
              </ReparationsEnCoursContextProvider>
            </ReparationsMecaniqueContextProvider>
          </ReparationsContextProvider>
        </AuthContextProvider>
      </ClientsContextProvider>
    </VehiculesContextProvider>
  </BrowserRouter>,
)
