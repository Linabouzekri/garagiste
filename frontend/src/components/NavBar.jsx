import React from 'react'
import { useLogout } from '../hooks/useLogout'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const {logout} = useLogout()
  const handelLogout = ()=>{
    logout()
  }
  
  return (
    <>
    

    <nav className="bg-gray-700">
      <div className="container mx-auto py-4 flex justify-between items-center">
     
        <div className="flex space-x-3 ml-5">
           
        
        </div>
       

        <div className="flex space-x-3 mr-7">
          <div className="flex items-center ">
            <Link className="text-gray-50 hover:text-black hover:bg-white px-4 py-1"  to={"/login"}>Login</Link>
          </div>
          
          <div className="flex items-center ">
            <Link  className="text-gray-50 hover:text-black hover:bg-white px-4 py-1" to={"/register"} >Register</Link>
          </div>
             
         
      
      </div>
      </div>
    </nav>
    </>
  )
}

export default NavBar