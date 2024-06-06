import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { API_BACKEND, API_FRONTEND } from '../../API/api'
import { useVehiculesContext } from '../../hooks/useVehiculesContext'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { BiShowAlt } from 'react-icons/bi'
import TableData from '../../components/TableData'
import { useClientsContext } from '../../hooks/useClientsContext'

const Gestionvehicule = () => {
    const { user } = useAuthContext()
    const {vehicules , dispatch} = useVehiculesContext()
    const {clients , dispatch : dispatchClients} = useClientsContext()
    const picREf = useRef()
    const [previewImage, setPreviewImage] = useState(API_FRONTEND + '/src/Images/vehicule2.png');

    const [search , setSearch] = useState("")
    const [filterData , setFilterDate] = useState([])
    const [vehiculeDelete , setVehiculeDelete]= useState(null)
    const [vehiculeUpdate , setVehiculeUpdate] = useState(null)
    const [vehiculeDetails, setVehiculeDetails] = useState(null);

      // error 
    const [errorDelete ,  setErrorDelete] = useState("")
    const [ errorUpdate , setErrorUpdate] = useState("")
    const [ errorAdd , setErrorAdd] = useState("")

      // models 
    const [isModalDeleteOpen , setIsModalDeleteOpen] = useState(false)
    const [isModalAddOpen , setIsModalAddOpen] = useState(false)
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);
        
    // vehicule
    const [photo, setPhoto] = useState(null);
    const [marque, setMarque] = useState('');
    const [model, setModel] = useState('');
    const [typeCarburant, setTypeCarburant] = useState('');
    const [immatricule, setImmatricule] = useState('');

    // select client 
    const [clientVoitureEmail , setClientsEmail] = useState("")
    const [clientVoitureId , setClientVoitureId] =useState(null)
    const [dropDownClient , setDropDownClient] = useState(false)    
    const [searchSelectClient , setSearchSelectClient] = useState("")
    const [filterDataClient , setFilterDateClient] = useState([])


    const clickImage=()=>{
        picREf.current.click();
        
     }

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

    const toggleDropDownClient = ()=>{
  setDropDownClient(!dropDownClient)
}

const toggleModalDetails = ()=>{
    setIsModalDetailsOpen(!isModalDetailsOpen)
}



    useEffect(()=>{
        const fetchVehicules = async ()=>{
            const response = await fetch(API_BACKEND +'/api/admin/vehicules' , {
                headers :{"Authorization" : `Bearer ${user.access_token}`}
            })
            const json = await response.json()
    
            if(response.ok){
                 dispatch({type : 'SET_VEHICULES' , payload : json.data})
                 setFilterDate(json.data)

                console.log(json.data);
            }
    
        }

        const fetchusers = async ()=>{
            const response = await fetch(API_BACKEND +'/api/admin/users' , {
                headers :{"Authorization" : `Bearer ${user.access_token}`}
            })
            const json = await response.json()
    
            if(response.ok){
                dispatchClients({type : 'SET_CLIENTS' , payload : json.data})
                setFilterDateClient(json.data)
              
            }
    
        }
    
        fetchusers()
    
        fetchVehicules()
    
    } , [])


    useEffect(()=>{

        const result = vehicules.filter((item)=>{
          return JSON.stringify(item)
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1
          
        });
      
       
        setFilterDate(result)
      
      } , [search ,vehicules  ])



      // filter input select clients 

    useEffect(()=>{
    
        const result = clients.filter((client)=>{
        return JSON.stringify(client)
        .toLowerCase()
        .indexOf(searchSelectClient.toLowerCase()) !== -1
        
        });
    
        setFilterDateClient(result)
    
    } , [searchSelectClient , clients ])
    

      const columns = [
        {
            name : "Photo",
            selector : (row) => <> <div className="flex-shrink-0 h-10 w-10">
                                       <img className="h-10 w-10 rounded-full" src={API_BACKEND +"/storage/" + row.photo} alt=""/>
                                  </div>
                                  </>,
            sortable: true
        },
        {
          name : "Marque",
          selector : (row) => row.marque,
          sortable: true
        },
        {
          name : "Model",
          selector : (row) => row.model,
          sortable: true
        },
     
        {
            name : "type Carburant",
            selector : (row) => row.typeCarburant,
            sortable: true
        },

        {
            name : "Matricule",
            selector : (row) => row.immatricule,
            sortable: true
        },

        {
            name : "Email",
            selector : (row) => row.user.email,
            sortable: true
        },
       
        {
          name : "Actions",
          cell : (row) => <div className='flex items-center justify-center'>
                <MdDelete onClick={()=> { deleteVehicule(row.id ) } } className="w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer mr-3" />
                <FaEdit onClick={()=> { modifierVehicule(row.id) }} className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mr-3" />
                <BiShowAlt onClick={()=>{detailsItem(row.id) }}  className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mr-3" />
      
          </div>
        }
      
      ] 


    // change functions 

    const handlePhotoChange = (e)=>{
        const selectedPhoto = e.target.files[0]
        setPhoto(selectedPhoto)
        setPreviewImage(URL.createObjectURL(selectedPhoto));
    }

    const handleChangeMarque = (e )=>{
        setMarque(e.target.value)
    }

    const handleChangeModel = (e )=>{
        setModel(e.target.value)
    }

    const handleChangeTypeCarburant = (e )=>{
        setTypeCarburant(e.target.value)
    }

    const handleChangeImmatricule = (e )=>{
        setImmatricule(e.target.value)
    }


    // delete client 
    const deleteVehicule= async(id) =>{
        //setClients(clients.filter(C=> C._id !== id));
        const vehicule = vehicules.filter(item=> item.id === id)[0]
        setVehiculeDelete(vehicule)
        setIsModalDeleteOpen(true)
        setErrorDelete("")
    
    }
  
    const handleDeleteVehiculeSubmit = async(e)=>{
        e.preventDefault();
        try{

        const requestData = {
            id: vehiculeDelete.id,
        };
        const response = await fetch( API_BACKEND+ "/api/admin/deleteVehicule", {
            method : 'DELETE' , 
            headers : {"Content-type" : 'application/json'},
            body:  JSON.stringify(requestData)
        })
        
        const res = await response.json() 
        if(response.ok){
            dispatch({type : 'DELETE_VEHICULE' , payload : res.id})
            setIsModalDeleteOpen(false)
            setErrorDelete("")
        }else{
            setErrorDelete(res.error)
        }


    }catch(error){
        console.log("error" , error);
    }

    }


    
    // ajouter Vehicule

    const AjouterVehicule = ()=>{
        setErrorAdd("")
        setMarque("")
        setModel("")
        setTypeCarburant("")
        setImmatricule("")
        setClientVoitureId(null)
        setClientsEmail("")
       
        setIsModalAddOpen(true)
     }

     
     const handleAddVehiculeSubmit = async(e) =>{
        e.preventDefault();

        
        const formData = new FormData();
        formData.append('marque', marque);
        formData.append('photo', photo);
        formData.append('typeCarburant', typeCarburant);
        formData.append('immatricule', immatricule);
        formData.append('model', model);
        formData.append('user_id' , clientVoitureId)

   

  


        const response = await fetch(API_BACKEND + '/api/admin/addVehicule', {
          method: 'POST',
          headers: { "Authorization": `Bearer ${user.access_token}` },
          body: formData
      });

        const json = await response.json()

        if(!response.ok){

            setErrorAdd(json.error)

        }

        if(response.ok){
          dispatch({type : 'CREATE_VEHICULE' , payload : json.data})
          setIsModalAddOpen(false)

          
         setMarque("")
         setModel("")
         setImmatricule("")
         setTypeCarburant("")
         setClientsEmail("")
         setClientVoitureId(null)
         setPhoto(null)
         setPreviewImage(API_FRONTEND + '/src/Images/vehicule2.png')
        }
      }
     
    // update Vehicule 

    const modifierVehicule = async(id) =>{
        setErrorUpdate("")
        const vehicule = vehicules.filter(item=> item.id === id)[0]
        setVehiculeUpdate(vehicule)
        setIsModalUpdateOpen(true)

        setMarque(vehicule.marque)
        setModel(vehicule.model)
        setImmatricule(vehicule.immatricule) 
        setTypeCarburant(vehicule.typeCarburant)

        setClientVoitureId(vehicule.user_id)
        setClientsEmail(vehicule.user.email)

        
        
    }

    const handleUpdateVehiculeSubmit = async(e)=>{
        e.preventDefault()

        const formData = new FormData();
        formData.append('marque', marque);
        formData.append('photo', photo);
        formData.append('typeCarburant', typeCarburant);
        formData.append('immatricule', immatricule);
        formData.append('model', model);
        formData.append('user_id' , clientVoitureId)

  


        const response = await fetch(API_BACKEND + '/api/admin/storeModifierVehicule/' + vehiculeUpdate.id,  {
          method: 'POST',
          headers: { "Authorization": `Bearer ${user.access_token}` },
          body: formData
      });

        const json = await response.json()

        console.log( "response " , json.data);

        if(!response.ok){

            setErrorUpdate(json.error)

        }

        if(response.ok){
            dispatch({type : 'UPDATE_VEHICULE' , payload : json.data})
            setIsModalUpdateOpen(false)
               
            setMarque("")
            setModel("")
            setImmatricule("")
            setTypeCarburant("")
            setClientsEmail("")
            setClientVoitureId(null)
            setPhoto(null)
            setPreviewImage(API_FRONTEND + '/src/Images/vehicule2.png')
        }
    }

    //details

    const detailsItem = async(id)=>{
        const vehicule =  vehicules.filter(item=> item.id === id)[0]

        console.log(vehicule);

        setVehiculeDetails(vehicule)
       
        setIsModalDetailsOpen(true)
        
        
    }

  return (
   <>
    <div className="ml-64">
      <div className="container mx-auto bg-white pt-8">
       
      <div className="p-8">
  
            <TableData 
                dataTab={filterData} 
                columns={columns} 
                title={"List Vehicules"}  
                addActions={AjouterVehicule} 
                search={search} 
                setSearch={setSearch}
                transactions={true}
              />
        </div>
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
                        <button onClick={handleDeleteVehiculeSubmit} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            Yes, I'm sure
                        </button>
                    </div>
                </div>
            </div>
        </div>
        }


             {/* Ajouter Vehicule */}

             {isModalAddOpen && (
                <div id="crud-modal" tabIndex="2" aria-hidden="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                    <div className="relative p-2 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto">
                        <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Ajouter Vehicule
                            </h3>
                            <button onClick={toggleModalAdd} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {errorAdd && <div className='text-red-700 text-center mt-2'>{errorAdd}</div>}

                        <form className="p-2 md:p-5" onSubmit={handleAddVehiculeSubmit} encType="multipart/form-data">
                            <div className="mb-2 flex justify-center items-center">
                                <input ref={picREf} type="file" id="image" accept="image/*" onChange={handlePhotoChange} hidden/>
                                <img onClick={clickImage} src={previewImage} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg"/>
                            </div>

                            <div className="flex">
                                <div className="w-1/4"> 
                                    <button onClick={toggleDropDownClient} id="dropdownUsersButton" data-dropdown-toggle="dropdownUsers" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                        liste Clients 
                                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="ml-3 w-3/4"> 
                                    <input value={clientVoitureEmail} type="email" name="client" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Email Client" required readOnly /> 
                                </div>
                            </div>

                            {dropDownClient && 
                                <div id="dropdownUsers" className="z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                                    <div className="p-3">
                                        <label htmlFor="input-group-search" className="sr-only">Search</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                </svg>
                                            </div>
                                            <input value={searchSelectClient} onChange={(e) => setSearchSelectClient(e.target.value)} type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Client" />
                                        </div>
                                    </div>
                                    <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                        {filterDataClient && filterDataClient.map((item, index) => (
                                            <li key={index}>
                                                <a onClick={() => { 
                                                        setClientVoitureId(item.id)
                                                        setClientsEmail(item.email)
                                                        setDropDownClient(false)
                                                    }} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    {item.email}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }

                            <div className="grid gap-4 mb-4 grid-cols-2 mt-2">
                                <div className="col-span-2">
                                    <label htmlFor="make" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">marque</label>
                                    <input type="text" name="make" required id="make" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeMarque} value={marque} />  
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
                                    <input type="text" name="model" required id="model" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeModel} value={model} />  
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="registration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type Carburant</label>
                                    <input type="text" name="registration" required id="registration" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeTypeCarburant} value={typeCarburant} />  
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="fulType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numero Matricule</label>
                                    <input type="text" name="fulType" required id="fulType" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeImmatricule} value={immatricule} />  
                                </div>  
                            </div>

                            <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Ajouter
                            </button>
                        </form>
                    </div>
                </div>
            )}


    {/* update Vehicule  Modal */}
    {isModalUpdateOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Modifier vehicule
                                </h3>
                                <button onClick={toggleModalUpdate} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {errorUpdate && <div className='text-red-700 text-center mt-2'> {errorUpdate}</div>}
                            
                                <form className="p-2 md:p-5" onSubmit={handleUpdateVehiculeSubmit} encType="multipart/form-data">
                                    <div className="mb-2 flex justify-center items-center">
                                        <input ref={picREf} type="file" id="image" accept="image/*" onChange={handlePhotoChange} hidden/>
                                        <img onClick={clickImage} src={previewImage} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg"/>
                                    </div>

                                    <div className="flex">
                                        <div className="w-1/4"> 
                                            <button onClick={toggleDropDownClient} id="dropdownUsersButton" data-dropdown-toggle="dropdownUsers" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                                liste Clients 
                                                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="ml-3 w-3/4"> 
                                            <input value={clientVoitureEmail} type="email" name="client" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="email Client" required readOnly /> 
                                        </div>
                                    </div>

                                    {dropDownClient && 
                                        <div id="dropdownUsers" className="z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                                            <div className="p-3">
                                                <label htmlFor="input-group-search" className="sr-only">Search</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                        </svg>
                                                    </div>
                                                    <input value={searchSelectClient} onChange={(e) => setSearchSelectClient(e.target.value)} type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Client" />
                                                </div>
                                            </div>
                                            <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                                {filterDataClient && filterDataClient.map((item, index) => (
                                                    <li key={index}>
                                                        <a onClick={() => { 
                                                                setClientVoitureId(item.id)
                                                                setClientsEmail(item.email)
                                                                setDropDownClient(false)
                                                            }} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            {item.email}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    }

                                    <div className="grid gap-4 mb-4 grid-cols-2 mt-2">
                                        <div className="col-span-2">
                                            <label htmlFor="make" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">marque</label>
                                            <input type="text" name="make" required id="make" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeMarque} value={marque} />  
                                        </div>
                                        <div className="col-span-2">
                                            <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
                                            <input type="text" name="model" required id="model" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeModel} value={model} />  
                                        </div>
                                        <div className="col-span-2">
                                            <label htmlFor="registration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type Carburant</label>
                                            <input type="text" name="registration" required id="registration" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeTypeCarburant} value={typeCarburant} />  
                                        </div>
                                        <div className="col-span-2">
                                            <label htmlFor="fulType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numero Matricule</label>
                                            <input type="text" name="fulType" required id="fulType" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeImmatricule} value={immatricule} />  
                                        </div>  
                                    </div>

                                    <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Modifier
                                    </button>
                                </form>
                        </div>
                    </div>
      )}

    {/* detials  */}

{isModalDetailsOpen && (
                  <div
                  id="crud-modal1"
                  tabIndex="2"
                  aria-hidden="true"
                  className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
                >
                  <div className="relative p-4 w-full max-w-6xl bg-white rounded-lg shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Details Vehicule</h3>
                      <button
                        onClick={toggleModalDetails}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-toggle="crud-modal"
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
                
                    <div className="p-4 md:p-5 overflow-y-auto">
                      <div className="mb-4">
                        <div className="bg-white overflow-hidden shadow rounded-lg border flex justify-evenly">
                          <div className="px-4 py-5 sm:px-6">
                            <div className="mb-4 flex justify-center items-center">
                              <img
                                src={API_BACKEND + "/storage/" + vehiculeDetails.photo}
                                className="h-auto max-w-40 rounded-lg"
                                alt=""
                              />
                            </div>
                          </div>
                
                          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Vehicule</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    <li> Mmatricule : {vehiculeDetails.immatricule}</li>
                                    <li> Marque: {vehiculeDetails.marque}</li>
                                    <li> Model: {vehiculeDetails.model}</li>
                                    <li> Type Carburant: {vehiculeDetails.typeCarburant}</li>
                                  </ul>
                                </dd>
                              </div>
                
                              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Client </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    <li>User Name : {vehiculeDetails.user.userName}</li>
                                    <li>Email : {vehiculeDetails.user.email} </li>
                                    <li>Address : {vehiculeDetails.user.adress}</li>
                                    <li>Phone : {vehiculeDetails.user.phone}</li>
                                    <li>Type : {vehiculeDetails.user.role === 0 ? "Client" : "Mecanicien"}</li>
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
                
                
)}

        
   </>
  )
}

export default Gestionvehicule