import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { API_BACKEND } from "../API/api";
import { Navigate } from "react-router-dom";
import { useVehiculesContext } from "./useVehiculesContext";



export const useLogin = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = useAuthContext()
    const {vehicules , dispatch : dispatchVehicule} = useVehiculesContext()

    const login = async(email , password) =>{
        setIsLoading(true)
        setError(null)

        const response =await fetch( API_BACKEND +'/api/login', {
            method : 'POST' , 
            headers : {"Content-type" : 'application/json'},
            body: JSON.stringify({email , password})

        })

        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError("email or password incorrect")

        }

        

        if(response.ok){
            const result = JSON.stringify(json.info)
             //save the user to local storage 

            localStorage.setItem('user_garagiste' , result)
            dispatch({type : 'LOGIN' , payload : json.info})
            dispatchVehicule({type : 'SET_VEHICULES' , payload : []})

            setIsLoading(false)

            return <Navigate to="/" />;

            // if (result.role === 2) {
            // console.log("admin");
            // return <Navigate to="/admin" />;
            // } else if (result.role === 1) {
            // console.log("Mecanicien");
            // return <Navigate to="/mecanicien" />;
            // } else {
            // console.log("Client");
            // return <Navigate to="/client" />;
            // }

             


        }
    }

    return {login , isLoading , error}
}