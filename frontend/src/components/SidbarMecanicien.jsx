import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

import logo from "../../public/images/logo.jpg"

//icons
import { FaCarAlt, FaEdit } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdCarRepair } from "react-icons/md";
import { AiFillTool } from "react-icons/ai";
import { API_BACKEND } from '../API/api';

const SidbarMecanicien = () => {

    const { user , dispatch } = useAuthContext()

    const [sidBarOpen , setSidBarOpen] = useState(false)

    // users information for update
    const [userName , setUserName] = useState("")
    const [email , setEmail] = useState("")
    const [phone , setPhone] = useState("")
    const [adress , setAdress] = useState("")
    const [password , setPassword] = useState("")

     //error
    const [ errorUpdate , setErrorUpdate] = useState("")

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

     // toogle functions
     const toggleModalUpdate = () => {
      setIsModalUpdateOpen(!isModalUpdateOpen);
    };

        // change functions 
  const handleChangeUserNameAdd = (e)=>{
    setUserName(e.target.value)
  }

  const handleChangeEmailAdd = (e)=>{
    setEmail(e.target.value)
  }

  const handleChangePasswordAdd = (e)=>{
    setPassword(e.target.value)
  }

  const handleChangePhoneAdd = (e)=>{
    setPhone(e.target.value)
  }

  const handleChangeAdressAdd = (e)=>{
    setAdress(e.target.value)
  }


  // update client

  const updateItem =()=>{
    setUserName(user.userName)
    setEmail(user.email)
    setPassword("")
    setPhone(user.phone)
    setAdress(user.adress)
    setPassword('')
    setIsModalUpdateOpen(true)
    setErrorUpdate("")
  }

  const  handleUpdateClientSubmit =async (e)=>{
    e.preventDefault();
    const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('userName', userName);
        formData.append('phone', phone);
        formData.append('adress', adress);

     


        const response = await fetch(API_BACKEND + '/api/client/update/'+user.id, {
          method: 'POST',
          headers: { "Authorization": `Bearer ${user.access_token}` },
          body: formData
      });

        const json = await response.json()

        if(!response.ok){

            setErrorAdd(json.error)

        }

        if(response.ok){

          dispatch({type : 'LOGIN' , payload : {
            ...user,
            "userName" : json.data.userName,
            "email" : json.data.email,
            "phone" : json.data.phone,
            "adress": json.data.adress
          }})
        
          setIsModalUpdateOpen(false)
        }

  }

  // logout 


     
    const {logout} = useLogout()
    const handelLogout = ()=>{
      logout()
    }

    const togleSidbar =()=>{

    }

    
  return (
    <>
    
    
 
<button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   <span className="sr-only">Open sidebar</span>
   <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
   </svg>
</button>

<aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">
  <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div id="sideNav" className="lg:block bg-white w-64 h-screen fixed rounded-none border-none">
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
                    <p className="text-xs text-gray-500 text-center">mecanicien</p>

                    <div className="text-xs text-gray-500 text-center flex justify-center cursor-pointer transition duration-300 hover:text-gray-700">
                      <FaEdit className='w-4 h-4 text-blue-500 hover:text-blue-700 cursor-pointer mr-3' onClick={updateItem} />
                    </div>

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
                        to={"/mecanicien/reparations"}
                            className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                        >
                      
                      
                        <MdCarRepair  className="w-6 h-6 fill-current inline-block" />
                        {/* <AiFillTool className="w-6 h-6 fill-current inline-block" /> */}
                        <span className=""> Reparations</span>
                    </Link>

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
  </div>
  
</aside>



{/* update Mecanicient  */}
   
{isModalUpdateOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Modifier Mecanicien
                                </h3>
                                <button onClick={toggleModalUpdate} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {errorUpdate && <div className='text-red-700 text-center mt-2'> {errorUpdate}</div>}
                            <form className="p-4 md:p-5" onSubmit={handleUpdateClientSubmit} encType="multipart/form-data">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                    

                                    <div className="col-span-2">
                                            <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
                                            <input type="text" name="userName" required id="userName"   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangeUserNameAdd} 
                                              value={userName} />  
                                    </div>

                                    
                                    <div className="col-span-2">
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                            <input type="email" readOnly name="email" required id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangeEmailAdd} 
                                              value={email} />  
                                    </div>

                                    <div className="col-span-2">
                                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                                            <input type="text" name="phone" required id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangePhoneAdd} 
                                              value={phone} />  
                                    </div>

                                    <div className="col-span-2">
                                            <label htmlFor="adress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                            <input type="text" name="adress" required id="adress" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangeAdressAdd} 
                                              value={adress} />  
                                    </div>

                                    <div className="col-span-2">
                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                            <input type="password" name="password"  id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangePasswordAdd} 
                                              value={password} />  
                                    </div>

                                   




                                </div>

                               
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Modifier
                                </button>

                               

                      
                            </form>
                        </div>
                    </div>
      )}
   







    </>
  )
}

export default SidbarMecanicien