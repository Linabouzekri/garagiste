import React, { useEffect, useState } from 'react'
import { API_BACKEND } from '../../API/api'

// icons 
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BiShowAlt } from "react-icons/bi";

import TableData from '../../components/TableData';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useClientsContext } from '../../hooks/useClientsContext';


const GestionClient = () => {
  const { user } = useAuthContext()
  const {clients , dispatch} = useClientsContext()

  //const [clients , setClients] = useState([])
  const [search , setSearch] = useState("")
  const [filterData , setFilterDate] = useState([])
  const [clientDelete , setClientDelete]= useState(null)
  const [clientUpdate , setClientUpdate] = useState(null)
  const [clientDetails, setClientDetails] = useState(null);

  // error 
  const [errorDelete ,  setErrorDelete] = useState("")
  const [ errorUpdate , setErrorUpdate] = useState("")
  const [ errorAdd , setErrorAdd] = useState("")

  // add 
  const [userName , setUserName] = useState("")
  const [email , setEmail] = useState("")
  const [phone , setPhone] = useState("")
  const [adress , setAdress] = useState("")
  const [password , setPassword] = useState("")
  const [isMecanique , setIsMecanique] = useState(false)

  // models 
  const [isModalDeleteOpen , setIsModalDeleteOpen] = useState(false)
  const [isModalAddOpen , setIsModalAddOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);

 
  

  useEffect(()=>{
      const fetchusers = async ()=>{
          const response = await fetch(API_BACKEND +'/api/admin/users' , {
              headers :{"Authorization" : `Bearer ${user.access_token}`}
          })
          const json = await response.json()
  
          if(response.ok){
              dispatch({type : 'SET_CLIENTS' , payload : json.data})
              setFilterDate(json.data)
          }
  
      }
  
      fetchusers()
  
  } , [])

  useEffect(()=>{

    const result = clients.filter((client)=>{
      return JSON.stringify(client)
      .toLowerCase()
      .indexOf(search.toLowerCase()) !== -1
      
    });
  
   
  
    setFilterDate(result)
  
  } , [search , clients ])

  // toggle functions 

  const toggleModalDelete = () => {
    setIsModalDeleteOpen(!isModalDeleteOpen);
  };

  const toggleModalAdd = () => {
    setIsModalAddOpen(!isModalAddOpen);
  };

  const toggleModalUpdate = () => {
    setIsModalUpdateOpen(!isModalUpdateOpen);
  };

  const toggleModalDetails = ()=>{
    setIsModalDetailsOpen(!isModalDetailsOpen)
}



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

  const isMecaniqueChange = (e)=>{
    setIsMecanique(e.target.checked)
  }

 

  
  const columns = [
    {
      name : "User Name",
      selector : (row) => row.userName,
      sortable: true
    },
    {
      name : "Email",
      selector : (row) => row.email,
      sortable: true
    },
    {
      name : "Adress",
      selector : (row) => row.adress,
      sortable: true
    },
    {
        name : "Phone",
        selector : (row) => row.phone,
        sortable: true
    },
    {
        name : "role",
        selector : (row) => row.role === 0 ? 'Client' : 'Mecanicien',
        sortable: true
    },

    {
      name : "Actions",
      cell : (row) => <div className='flex items-center justify-center'>
            <MdDelete onClick={()=> { deleteClient(row.id )} } className="w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer mr-3" />
            <FaEdit onClick={()=> {modifierClient(row.id)}} className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mr-3" />
            <BiShowAlt onClick={()=>{detailsItem(row.id) }}  className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mr-3" />
  
      </div>
    }
  
  ] 



  // delete client 
  const deleteClient= async(id) =>{
    //setClients(clients.filter(C=> C._id !== id));
    const client = clients.filter(item=> item.id === id)[0]
    setClientDelete(client)
    setIsModalDeleteOpen(true)
    setErrorDelete("")
  
  }
  
  const handleDeleteClientSubmit = async(e)=>{
    e.preventDefault();
    try{

      const requestData = {
        id: clientDelete.id,
      };
      const response = await fetch( API_BACKEND+ "/api/admin/deleteUtilisateur", {
        method : 'DELETE' , 
        headers : {"Content-type" : 'application/json'},
        body:  JSON.stringify(requestData)
      })
      
      const res = await response.json() 
      if(response.ok){
        dispatch({type : 'DELETE_CLIENT' , payload : res.id})
        setIsModalDeleteOpen(false)
        setErrorDelete("")
      }else{
        setErrorDelete(res.error)
      }


  }catch(error){
    console.log("error" , error);
  }

  }




      // ajouter Client  
      const AjouterClient = ()=>{
         setErrorAdd("")
         setUserName("")
         setEmail("")
         setPassword("")
         setPhone("")
         setAdress("")
         setIsMecanique(false)
        
         setIsModalAddOpen(true)
      }
      

      const handleAddClientSubmit = async(e) =>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('userName', userName);
        formData.append('phone', phone);
        formData.append('adress', adress);

        if(isMecanique){
            formData.append('role', isMecanique);
        }


        const response = await fetch(API_BACKEND + '/api/admin/addUtilisateur', {
          method: 'POST',
          headers: { "Authorization": `Bearer ${user.access_token}` },
          body: formData
      });

        const json = await response.json()

        if(!response.ok){

            setErrorAdd(json.error)

        }

        if(response.ok){
          dispatch({type : 'CREATE_CLIENT' , payload : json.data})
          setIsModalAddOpen(false)

          setUserName("")
          setEmail("")
          setPassword("")
          setPhone("")
          setAdress("")
          setIsMecanique(false)
        }
      }


      // update Client 

      const modifierClient= (id) =>{
        setErrorUpdate("")
        const client = clients.filter(item=> item.id === id)[0]
        setClientUpdate(client)
        setIsModalUpdateOpen(true)
        
        setUserName(client.userName)
        setEmail(client.email)
        setPassword("")
        setPhone(client.phone)
        setAdress(client.adress)
        setIsMecanique(client.role)
      }


      const handleUpdateClientSubmit = async(e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('userName', userName);
        formData.append('phone', phone);
        formData.append('adress', adress);

        if(isMecanique){
            formData.append('role', isMecanique);
        }

        const response = await fetch( API_BACKEND + "/api/admin/modifierUtilisateur/" + clientUpdate.id , {
          method :"POST" , 
          headers: { "Authorization": `Bearer ${user.access_token}` },
          body: formData
        })
    
        const res = await response.json()
    
      if(!response.ok){
          setErrorUpdate(res.error)
      }
    
      if(response.ok){
        dispatch({type : 'UPDATE_CLIENT' , payload : res.data})
       
        setIsModalUpdateOpen(false)

        setUserName("")
        setEmail("")
        setPassword("")
        setPhone("")
        setAdress("")
        setIsMecanique(false)
    
      }


      }   
      
      // details 

      const detailsItem = async(id)=>{
        const client =  clients.filter(item=> item.id === id)[0]

        console.log(client);

        setClientDetails(client)
       
        setIsModalDetailsOpen(true)
        
        
    }




  return (
  <>


<div className="p-4 sm:ml-64">
   <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
      
    <TableData 
        dataTab={filterData} 
        columns={columns} 
        title={"List Utilisateur"}  
        addActions={AjouterClient} 
        search={search} 
        setSearch={setSearch}
        transactions={true}
    />
    
   </div>
</div>
   


    {/* Delete */}
    {isModalDeleteOpen &&

    <div id="deleteModal" className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
        <div className="relative p-4 w-full max-w-md">
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <button onClick={toggleModalDelete} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                </button>
                { errorDelete && <div className='text-red-700'>{errorDelete}</div>}
                <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
                <div className="flex justify-center items-center space-x-4">
                    <button onClick={toggleModalDelete} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                        No, cancel
                    </button>
                    <button onClick={handleDeleteClientSubmit} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                        Yes, I'm sure
                    </button>
                </div>
            </div>
        </div>
    </div>
    }

     {/* Ajouter Client */}

     {isModalAddOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Ajoutre Utilisateur
                                </h3>
                                <button onClick={toggleModalAdd} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {errorAdd && <div className='text-red-700 text-center mt-2'> {errorAdd}</div>}

                            <form className="p-4 md:p-5" onSubmit={handleAddClientSubmit} encType="multipart/form-data">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                    

                                <div className="col-span-2">
                                        <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
                                        <input type="text" name="userName" required id="userName"   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangeUserNameAdd} 
                                           value={userName} />  
                                </div>

                                
                                <div className="col-span-2">
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" name="email" required id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangeEmailAdd} 
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
                                        <input type="password" name="password" required id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangePasswordAdd} 
                                           value={password} />  
                                </div>

                                <div>
                                    <label htmlFor="acc">
                                    Compte Mécanicien
                                        <input type="checkbox" id="acc" name="role" checked={isMecanique} onChange={isMecaniqueChange} />
                                        <span className="checkmark"></span>
                                    </label>
                                    
                                </div>

                                </div>

                               
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Ajouter
                                </button>

                               

                      
                            </form>
                        </div>
                    </div>
      )}
    

        {/* update Client  Modal */}
        {isModalUpdateOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Modifier Utilisateur
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
                                            <input type="email" name="email" required id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleChangeEmailAdd} 
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

                                    <div>
                                        <label htmlFor="acc">
                                        Compte Mécanicien
                                            <input type="checkbox" id="acc" name="role" checked={isMecanique} onChange={isMecaniqueChange} />
                                            <span className="checkmark"></span>
                                        </label>
                                        
                                    </div>




                                </div>

                               
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                   Modifier
                                </button>

                               

                      
                            </form>
                        </div>
                    </div>
      )}

        {/* Details */}
        {isModalDetailsOpen && (
                                <div
                                id="crud-modal1"
                                tabIndex="2"
                                aria-hidden="true"
                                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
                                >
                                <div className="relative p-4 w-full max-w-6xl bg-white rounded-lg shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Details Utilisateur</h3>
                                    <button
                                        onClick={toggleModalDetails}
                                        type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-toggle="crud-modal1"
                                    >
                                        <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    </div>
                                
                                    <div className="flex rounded justify-center my-2 ">
                 
                 <div className=" w-11/12 overflow-hidden  flex justify-evenly">
                               <div className="px-4 py-5 sm:px-6">
                                 
                                   <div className="mb-4 flex flex-col items-center">
                                       <div>
                                         <dl className="sm:divide-y sm:divide-gray-200">
                                             <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                             
                                               <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                 <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                                   <li>User Name : {clientDetails.userName}</li>
                                                   <li>Email: {clientDetails.email}</li>
                                                   <li>Address: {clientDetails.adress}</li>
                                                 </ul>
                                               </dd>
                                             </div>
                               
                                           </dl>
                                       </div>
                                   </div>
                               </div>
     
                               <div className="px-4 py-5 sm:px-6">
                                 
                                 <div className="mb-4 flex flex-col items-center">
                                     <div>
                                       <dl className="sm:divide-y sm:divide-gray-200">
                                           <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                           
                                             <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                               <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                               
                                          
                                               <li>Phone : {clientDetails.phone}</li>
                                               <li>Type : {clientDetails.role === 0 ? 'Client' : 'Mecanicien'}</li>
                                               </ul>
                                             </dd>
                                           </div>
                             
                                         </dl>
                                     </div>
                                 </div>
                             </div>
     
                            
     
                 </div>
              </div>
     
                                
                                </div>
                                </div>
                                
                                
                )}

  
  </>
  )
}

export default GestionClient