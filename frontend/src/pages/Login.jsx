import React, { useEffect, useState } from 'react'
import image from "../../public/images/login1.jpg"
import { useLogin } from '../hooks/useLogin'
import { API_BACKEND } from '../API/api'
const Login = () => {
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [rememberMe , setRememberMe] = useState(true)

  const {login , isLoading , error} = useLogin()


  
    // forget password
    const [isForgetModal , setIsForgetModal] = useState(false)
    const [emailForgot , setEmailForgot] = useState('')
    const [codeForgot , setCodeForgot] = useState('')
    const [newPasswordForgot , setNewPasswordForgot] = useState('')
    const [verifyEmailForm , setVerifyEmailForm] = useState(false)
    const [verifyCodeForm , setVerifyCodeForm] = useState(false)
    const [verifyNewPasswordForm , setVerifyNewPasswordForm] = useState(false)
    const [errorForgetPassword , setErrorForgetPassword ] = useState('')


  useEffect (()=>{
    const emailLocal = localStorage.getItem('email');
    const passwordLocal = localStorage.getItem('password') 
    if(emailLocal , passwordLocal){
        setEmail(emailLocal)
        setPassword(passwordLocal)
    }
    
}, [])
  

  const handleChangeEmail = (e)=>{
    setEmail(e.target.value)
  }

  const handeleChangePasswoed = (e)=>{
      setPassword(e.target.value)
  }

  const rememberMeChange = (e)=>{
    setRememberMe(e.target.checked);
}

// login 

const handleSubmitLogin = async(e)=>{
  e.preventDefault()

  await login(email , password)

  if(rememberMe){
    localStorage.setItem("email", email);
    localStorage.setItem("password" , password)
  }else{
      localStorage.setItem("email", "");
      localStorage.setItem("password" , "")
  }

}


// forget Password 


const toggleModalForgot = ()=>{
  setIsForgetModal(false)
}



const changeEmailForgot = (e)=>{
  setEmailForgot(e.target.value)
}

const changeCodeForgot = (e)=>{
  setCodeForgot(e.target.value)
}


const handlePasswordChange = (e) => {
setPassword(e.target.value);
};

const changeNewPasswordForgot = (e)=>{
setNewPasswordForgot(e.target.value)
}

const handleForgetModel = ()=>{
  setIsForgetModal(true)
  setVerifyEmailForm(true)
  setVerifyCodeForm(false)
  setVerifyNewPasswordForm(false)
  setErrorForgetPassword("")
}

// send formulaire forget 
const handleForgotPassword = async (e)=>{
  e.preventDefault()

  // verifier si email existe et envoyer email vers utilisateur 
  const response =await fetch( API_BACKEND +'/api/email/forgetpassword/veryexistMail', {
      method : 'POST' , 
      headers : {"Content-type" : 'application/json'},
      body: JSON.stringify({ email : emailForgot})

  })

  const json = await response.json()

 if(response.ok){

      if(json){
          setVerifyEmailForm(false)
          setVerifyCodeForm(true)
          setErrorForgetPassword("")
      }else{
        setErrorForgetPassword("email Incorrect")
      }

 }else{
  setErrorForgetPassword("email Incorrect")
 }

  
}

const handleForgotCode = async (e)=>{
  e.preventDefault()

  const response =await fetch( API_BACKEND +'/api/email/verify', {
      method : 'POST' , 
      headers : {"Content-type" : 'application/json'},
      body: JSON.stringify({ email : emailForgot , code : codeForgot})

  })

  const json = await response.json()

 if(response.ok){

      if(json){
          setVerifyCodeForm(false)
          setVerifyNewPasswordForm(true)
      }else{
          setErrorForgetPassword("code Incorrect")
      }

 }else{
  setErrorForgetPassword("code incorrect")
 }



}

const handleForgotNewPassword = async(e)=>{
  e.preventDefault()

  const response =await fetch( API_BACKEND +'/api/forgetpassword', {
      method : 'POST' , 
      headers : {"Content-type" : 'application/json'},
      body: JSON.stringify({ email : emailForgot , password : newPasswordForgot})

  })

  const json = await response.json()

  if(response.ok){

       if(json){
           setIsForgetModal(false)
       }else{
           setErrorForgetPassword("error Password ")
       }

  }else{
   setErrorForgetPassword(json.error)
  }

}



  return (
  <>
         
      <div className="flex flex-col md:flex-row h-[91vh]">
            <div className="w-full bg-gray-100 md:w-1/2 flex flex-col items-center justify-center">
            

            
              <div className="max-w-md w-full p-6">
                  <h1 className="text-3xl font-semibold mb-6 text-black text-center">LOGIN</h1>

                    {error && <div className='text-red-500 text-center' >{error}</div> }
                  <form method="POST" onSubmit={handleSubmitLogin} className="space-y-4">
                  
                      <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input type="text" name="email" id="email"  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"  value={email} onChange={handleChangeEmail}/> 
                        
                        </div>
                      <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                          <input  type="password" name="password" id="password"   className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" value={password} onChange={handeleChangePasswoed} /> 
                      </div>

                      <div className="mb-3 form-check">
                        <input type="checkbox" name="remember" className="form-check-input" id="remember" checked={rememberMe} onChange={rememberMeChange}  />
                        <label className="form-check-label" htmlFor="remember">Remember Me</label>
                      </div>



                      <div>
                          <button type="submit" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">Sign Up</button>
                      </div>
                  </form>
                        
                  <div className='mt-3'>
                            <a onClick={handleForgetModel}  className="text-sm text-blue-700 dark:text-blue-400 hover:underline">Forgot Password?</a>
                  </div>

                  <div className="mt-4 text-sm text-gray-600 text-center">
                      <p>Already have an account? <a href="/register" className="text-black hover:underline">sign up here</a></p>
                  </div>
              </div>
            </div>
        
        
            <div className=" flex items-center justify-center flex-1 bg-white text-black">
                <div className="h-full w-full">
                    <img className="h-full w-full" src={image} alt="" />
                </div>
            </div>
      </div>


      
      {/* Forgot Password */}

      {isForgetModal && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-xl max-h-screen bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Validation Mail 
                                </h3>
                                <button onClick={toggleModalForgot} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div >
                            {errorForgetPassword &&
                                <div className='text-red-500 text-center' >
                                    {errorForgetPassword}
                                </div>
                            }
                            
                            {verifyEmailForm && 
                                <form onSubmit={handleForgotPassword}  className="p-4 md:p-5"  >
                                    <div className="mb-5">
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                required 
                                            onChange={changeEmailForgot}
                                            value={emailForgot}
                                        />
                                    </div>
                                    <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Verifier
                                    </button>

                                </form>
                            }

                            {verifyCodeForm && 
                                <form onSubmit={handleForgotCode}  className="p-4 md:p-5"  >
                                    <div className="mb-5">
                                        <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
                                        <input type="text" id="code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                required 
                                            onChange={changeCodeForgot}
                                            value={codeForgot}
                                        />
                                    </div>
                                    <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Verifier Code
                                    </button>

                                </form>
                            }

                            
                            {verifyNewPasswordForm && 
                                <form onSubmit={handleForgotNewPassword}  className="p-4 md:p-5"  >
                                    <div className="mb-5">
                                        <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nouveau Password</label>
                                        <input type="text" id="newPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                required 
                                            onChange={changeNewPasswordForgot}
                                            value={newPasswordForgot}
                                        />
                                    </div>
                                    <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        change Mot de passe
                                    </button>

                                </form>
                            }

                           
                        </div>
                    </div>
                )}


   
  </>
  )
}

export default Login