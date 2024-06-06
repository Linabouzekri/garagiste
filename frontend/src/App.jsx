import { useState , useEffect} from 'react'

import './App.css'
import { Navigate, Route, Router, Routes, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import Register from './pages/Register'
import { useAuthContext } from './hooks/useAuthContext'
import Admin from './pages/Admin'
import Mecanicien from './pages/Mecanicien'
import Client from './pages/Client'
import SidBarAdmin from './components/SidBarAdmin'
import GestionClient from './pages/Admin/GestionClient'
import Gestionvehicule from './pages/Admin/Gestionvehicule'
import SidbarClient from './components/SidbarClient'
import Vehicules from './pages/Client/Vehicules'
import Reparations from './pages/Client/Reparations'
import SidbarMecanicien from './components/SidbarMecanicien'

import ReparationsMecanique from './pages/Mecanicien/ReparationsMecanique'

import GestionReparationEnAttenete from './pages/Admin/GestionReparationEnAttenete'
import GestionReparationEnCours from './pages/Admin/GestionReparationEnCours'
import GestionReparationTermine from './pages/Admin/GestionReparationTermine'


function App() {

  const { user } = useAuthContext()
  
  const [currentUrl , setCurrentUrl] = useState('/');
  const [prevUrl , setPrevUrl] = useState('/')
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    setPrevUrl(currentUrl)
    setCurrentUrl(currentPath);
  
}, [currentPath]);




  
  function ChekAdmin ({children}){
    const utilisateur = JSON.parse(localStorage.getItem('user_garagiste'));
   

    if(utilisateur){
      const role = utilisateur.role 

        if(role === 2 ){
          return <>{children}</>
        }else if(role === 1 ){
          return <Navigate to="/mecanicien" />
        }else{
          return <Navigate to="/client" />
        }

    }else{
      return  <Navigate to="/login" />
    }
    
  }

  function ChekClient ({children}){
    const utilisateur = JSON.parse(localStorage.getItem('user_garagiste'));

    if(utilisateur){
      const role = utilisateur.role 

        if(role === 2 ){
          return <Navigate to="/" />
        }else if(role === 1 ){
          return <Navigate to="/mecanicien" />
        }else{
          return <>{children}</>
        }

    }else{
      return  <Navigate to="/login" />
    }
  }


  function ChekMecanicient ({children}){
    const utilisateur = JSON.parse(localStorage.getItem('user_garagiste'));

    if(utilisateur){
      const role = utilisateur.role 

        if(role === 2 ){
          return <Navigate to="/" />
        }else if(role === 1 ){
          return <>{children}</>
        }else{
          return <Navigate to="/client" />
        }

    }else{
      return  <Navigate to="/login" />
    }
  }


  function CheckLogin ({children}){

    
      if(!user){
        
        return <>{children}</>
      }else{
        if(currentUrl === "/login"){
          return  <Navigate to={prevUrl} />
        }else{
          return  <Navigate to={"/"} />
        }

      
      }
  }


  
  
  
  
  return (
    <>
    {!user &&  <NavBar/>}
    
   
    <Routes>

      {/* routes admin */}

        <Route  path='/' element={user ? 
          <ChekAdmin>
            <SidBarAdmin/>
            <Admin/>
          
          </ChekAdmin> :  <Navigate to="/login" />} 
        />

        <Route path='/gestionsclient' element={user ? 
                <ChekAdmin>        
                    <SidBarAdmin/>
                    <GestionClient/>
                </ChekAdmin> :  <Navigate to="/login" />} 
        />

        <Route path='/gestionsvehicule' element={user ? 
                <ChekAdmin>        
                    <SidBarAdmin/>
                    <Gestionvehicule/>
                </ChekAdmin> :  <Navigate to="/login" />} 
        />

        <Route path='/gestionsreparations/enattente' element={user ? 
                <ChekAdmin>        
                    <SidBarAdmin/>
                    
                    <GestionReparationEnAttenete />
                </ChekAdmin> :  <Navigate to="/login" />} 
        />

        <Route path='/gestionsreparations/encours' element={user ? 
                <ChekAdmin>        
                  
                    <SidBarAdmin/>
                    <GestionReparationEnCours />
                </ChekAdmin> :  <Navigate to="/login" />} 
        />

        <Route path='/gestionsreparations/termine' element={user ? 
                <ChekAdmin>       
                   
                    <SidBarAdmin/>
                    <GestionReparationTermine />
                </ChekAdmin> :  <Navigate to="/login" />} 
        />



      {/* end Routes admin */}



      {/* start routes Client */}

       <Route path='/client' element={ user ? 
          <ChekClient>
              <SidbarClient />
              <Client/>
          </ChekClient>  : <Navigate to="/login" /> } 
       />

        <Route path='/client/vehicules' element={ user ? 
          <ChekClient>
              <SidbarClient />
              <Vehicules/>
          </ChekClient>  : <Navigate to="/login" /> } 
       />

        <Route path='/client/reparations' element={ user ? 
          <ChekClient>
              <SidbarClient />
              <Reparations/>
          </ChekClient>  : <Navigate to="/login" /> } 
       />

      {/*end  routes Client */}

      {/* start routes Mecanicient */}
      
       <Route path='/mecanicien' element={user ?
          <ChekMecanicient>
            <SidbarMecanicien/>
            <Mecanicien/>
          </ChekMecanicient>  : <Navigate to="/login" />}
       />
        <Route path='/mecanicien/reparations' element={user ?
          <ChekMecanicient>
            <SidbarMecanicien/>
            <ReparationsMecanique />
          </ChekMecanicient>  : <Navigate to="/login" />}
        />

      



      {/* end routes Mecanicient */}
         

     

     
      <Route path="/login" element={<CheckLogin><Login /> </CheckLogin>} />
      <Route path="/register" element={!user ? <Register /> :  <Navigate to="/" /> } />
      </Routes>
    </>
  )
}



export default App


