import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

import logo from "../../public/images/logo.jpg"

//icons
import { FaCarAlt } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GiAutoRepair } from 'react-icons/gi';
import { GrInProgress } from "react-icons/gr";
import { FaBusinessTime } from "react-icons/fa6";
import { BsCalendar2CheckFill } from "react-icons/bs";


const SidBarAdmin = () => {

  const [listeReparation , setListeReparation] = useState(false)

  const { user } = useAuthContext()
  const {logout} = useLogout()
  const handelLogout = ()=>{
    logout()
  }


  const toogleLisetReparation = ()=>{
    setListeReparation(!listeReparation)
  }
  
  return (
   <>

    
  
<button  data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   <span className="sr-only">Open sidebar</span>
   <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
   </svg>
</button>

<aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform " aria-label="Sidenav">

  <div id="sidebar"
       
       
       >
   
          <div className="space-y-6 md:space-y-10 mt-10">
            
           
            <div id="profile" className="space-y-3">
              <img
                src={logo}
                alt="Avatar user"
                className="w-10 md:w-16 rounded-full mx-auto"
              />
              <div>
                <h2
                  className="font-medium text-xs md:text-sm text-center text-teal-500"
                >
                  {user && <>{user.userName}</>}
                </h2>
                <p className="text-xs text-gray-500 text-center">Administrator</p>
              </div>
            </div>
     
            <div id="menu" className="flex flex-col space-y-2">
              
                <Link
                    to={"/"}
                    className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out"
                    >
                    <svg
                    className="w-6 h-6 fill-current inline-block"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    ></path>
                    </svg>
                    <span className="">Home</span>
                </Link>
           

                <Link
                    to={"/gestionsclient"}
                    className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                    >
                   <IoMdPerson className="w-6 h-6 fill-current inline-block" />
                    <span className="">Gestion Utilisateurs</span>
                </Link>
               
                
                <Link
                    to={"/gestionsvehicule"}
                        className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                    >
                   
                    <FaCarAlt  className="w-6 h-6 fill-current inline-block" />
                    <span className="">Gestion Vehicules</span>
                </Link>

                <span onClick={toogleLisetReparation}
                   
                        className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                    >
                   
                    <GiAutoRepair  className="w-6 h-6 fill-current inline-block" />
                    <span className="">Gestion Reparations</span>
                </span>

                {listeReparation && 
                  <>
                  
                      <Link  
                      to={"/gestionsreparations/enattente"}  className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                    >
                      
                        <FaBusinessTime  className="w-6 h-6 fill-current inline-block ml-3 mr-1" />
                        <span className="">En Attente</span>

                    </Link>

                    <Link to={"/gestionsreparations/encours"}  className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                        >
                      
                        <GrInProgress    className="w-6 h-6 fill-current inline-block ml-3 mr-1" />
                        <span className="">En cours</span>

                    </Link>

                    <Link to={"/gestionsreparations/termine"}  className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                        >
                      
                        <BsCalendar2CheckFill  className="w-6 h-6 fill-current inline-block ml-3 mr-1" />
                        <span className="">Terminer</span>

                    </Link>

                  </>

                }

              


                <Link
                onClick={handelLogout}
                    className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                >
                   <IoLogOut className="w-6 h-6 fill-current inline-block" />
                    <span className="">Logout</span>
                </Link>

               
                
         
            
            </div>
          </div>
        </div>

  
</aside>

   </>
  )
}

export default SidBarAdmin