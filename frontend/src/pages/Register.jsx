import React, { useState } from 'react'

import image from "../../public/images/login1.jpg"
import { useSignup } from '../hooks/useSignup'
import { API_BACKEND } from '../API/api'

const Register = () => {
    const [userName , setUserName] = useState("")
    const [email , setEmail] = useState("")
    const [phone , setPhone] =useState("")
    const [adress , setAdress] =useState("")
    const [password , setPassword] =useState("")
    const [isMecanique , setIsMecanique] = useState(false)
    const [isModalVerifyOpen , setIsModalVerifyOpen] = useState(false)

    const [code , setCode ] = useState("")
    const [errorCode , setErrorCode] = useState("")
    const [errorSignUp , setErrorSignUp] = useState("")

    const {signup , isLoading , error} = useSignup()


    const handleChangeUserName = (e)=>{
        setUserName(e.target.value) 
    }

    const handleChangeEmail = (e)=>{
        setEmail(e.target.value)
    }
    const handleChangePhone = (e)=>{
        setPhone(e.target.value)
    }

    const handleChangeAdress = (e)=>{
        setAdress(e.target.value)
    }

    const handleChangePassword = (e)=>{
        setPassword(e.target.value)
    }

    const isMecaniqueChange = (e)=>{
        setIsMecanique(e.target.checked)
    }

    const handleChangeCode = (e)=>{
        setCode(e.target.value)
    }
    


    // function toogles 

    const toggleModalVerify = ()=>{
        setIsModalVerifyOpen(!isModalVerifyOpen)
        
        
    }

    // Register 

    const handleSubmitRegister = async(e)=>{
        setErrorSignUp("")
        e.preventDefault();
       
        setErrorCode("")
        // send email verify 

        const formData = new FormData();
        formData.append('title', "verification mail");
        formData.append('email' , email)

        const response = await fetch(API_BACKEND + '/api/email' , {
            method: 'POST',
            headers: {
               // "Accept": "application/json" 
            },
            body: formData
        });
  
        const json = await response.json()

        

        if(!response.ok){
            setErrorSignUp("email deja existe")
        }

        if(response.ok){
            console.log(json.result); 
            setIsModalVerifyOpen(true)
        }

        
    }

    const handleVerifyMailSubmit = async(e)=>{
        e.preventDefault()
        const formData = new FormData();
        formData.append('code', code);
        formData.append('email' , email)

        const response = await fetch(API_BACKEND + '/api/email/verify' , {
            method: 'POST',
            headers: {
               // "Accept": "application/json" 
            },
            body: formData
        });
  
        const json = await response.json()

        if(!response.ok){
            setErrorCode(json.error)
        }
 
         if(response.ok){
            console.log(phone , email);
            signup(userName , email , phone ,adress , password  , isMecanique) 
            setIsModalVerifyOpen(false)
         }

       



    }

   
  return (
    <>
    <div className="flex flex-col md:flex-row h-[91vh]">
      <div className="w-full bg-gray-100 md:w-1/2 flex flex-col items-center justify-center">

        <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">Register</h1>

            {error && <div className='text-red-500'>{error}</div> }
            {errorSignUp && <div className='text-red-500'>{errorSignUp}</div> }
          
            <form method="POST" onSubmit={handleSubmitRegister}  className="space-y-4">

                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">User Name</label>
                    <input  type="text" id="userName" name="userName" required value={userName} onChange={handleChangeUserName}  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
                    
                </div>


                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" aria-describedby="emailHelp" required name="email" value={email} onChange={handleChangeEmail}    className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
                   
                </div>
               

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input  type="text" id="phone" name="phone" value={phone} required onChange={handleChangePhone}   className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" /> 
                 
                </div>

       

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Adress</label>
                    <input type="text" id="adress" name="adress" value={adress} required onChange={handleChangeAdress}   className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
                  
                </div>

                <div>
                    <label htmlFor="password1" className="block text-sm font-medium text-gray-700">Password</label>
                    <input   type="password"  id="password" name="password1" required value={password} onChange={handleChangePassword}  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
                 

                </div>

                

                <div className="col-lg-12">
                    <div>
                        <label htmlFor="acc">
                        Compte Mécanicien
                            <input type="checkbox" id="acc" name="role" checked={isMecanique} onChange={isMecaniqueChange} />
                            <span className="checkmark"></span>
                        </label>
                        
                    </div>
                        
                        
                </div>



                <div>
                    <button type="submit" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">Sign Up</button>
                </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
                <p>Already have an account? <a href="/login" className="text-black hover:underline">sign in here</a></p>
            </div>
        </div>
      </div>
   
    
      <div className=" flex items-center justify-center flex-1 bg-white text-black">
          <div className="h-full w-full">
              <img className="h-full w-full" src={image} alt="" />
          </div>
      </div>
    </div>




       {/* Verify Mail */}
       {isModalVerifyOpen &&

            <div id="deleteModal" className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
                <div className="relative p-4 w-full max-w-md">
                    <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        <button onClick={toggleModalVerify} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        {errorCode && <div className='text-red-500'>{errorCode}</div> }
                        {/* { errorDelete && <div className='text-red-700'>{errorDelete}</div>} */}
                        <div className='mb-4'>
                                <label htmlFor="code" className=" float-start block text-sm font-medium text-gray-700">Code Verification</label>
                                <input type="Number" id="code" name="code"  value={code} required onChange={handleChangeCode}   className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
                            
                        </div>

                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={toggleModalVerify} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                cancel
                            </button>
                            <button onClick={handleVerifyMailSubmit} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-900">
                                verify
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        }

    </>
  )
}

export default Register