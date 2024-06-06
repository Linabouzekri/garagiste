import React, { useEffect, useRef, useState } from 'react'

import { useAuthContext } from '../../hooks/useAuthContext'
import { useVehiculesContext } from '../../hooks/useVehiculesContext'
import { API_BACKEND, API_FRONTEND } from '../../API/api'
// icons
import CardVehicule from '../../components/CardVehicule'
import { IoIosAddCircle } from "react-icons/io"

const Vehicules = () => {

    const { user } = useAuthContext()
    const {vehicules , dispatch} = useVehiculesContext()
    const [vehiculeDeleteID , setVehiculeDeleteId] = useState(null) 

    const [search , setSearch] = useState("")
    const [filterData , setFilterDate] = useState([])

    const picREf = useRef()
    const [previewImage, setPreviewImage] = useState(API_FRONTEND + '/src/Images/vehicule2.png');

     // vehicule
     const [photo, setPhoto] = useState(null);
     const [marque, setMarque] = useState('');
     const [model, setModel] = useState('');
     const [typeCarburant, setTypeCarburant] = useState('');
     const [immatricule, setImmatricule] = useState('');

    // models 
    const [isModalAddOpen , setIsModalAddOpen] = useState(false)

    // error 
    
    const [ errorAdd , setErrorAdd] = useState("")

    const clickImage=()=>{
        picREf.current.click();
        
     }

    // toggle functions 
   
     
    useEffect(()=>{
        const fetchVehicules = async ()=>{
            const response = await fetch(API_BACKEND +'/api/client/vehicules/' + user.id , {
                headers :{"Authorization" : `Bearer ${user.access_token}`}
            })
            const json = await response.json()
    
            if(response.ok){
                 dispatch({type : 'SET_VEHICULES' , payload : json.data})
                 setFilterDate(json.data)

                console.log(json.data );
            }
    
        }

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

    // functions toogle 

    const toggleModalAdd = () => {
        setIsModalAddOpen(!isModalAddOpen);
    };

     // ajouter Vehicule

    const AjouterVehicule = ()=>{
    setErrorAdd("")
    setMarque("")
    setModel("")
    setTypeCarburant("")
    setImmatricule("")
 
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
    formData.append('user_id' , user.id)






    const response = await fetch(API_BACKEND + '/api/client/addVehicule', {
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
        
        setPhoto(null)
        setPreviewImage(API_FRONTEND + '/src/Images/vehicule2.png')
    }
    }



  return (
  <>
  
<div className="p-4 sm:ml-64">
   <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
      
       
   <form className="max-w-md mx-auto mt-4 mb-4">   
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none" placeholder="Search Vehicules" required value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
    </form>

  <div className='flex justify-end pb-3' >
    <button onClick={AjouterVehicule} > <IoIosAddCircle className='size-7' /></button>
  </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-center px-2 mx-auto">

               {filterData && filterData.map((item)=>{
                    return <CardVehicule key={item.id} vehicule = {item}   />
               })}

            </div>
        
     
   </div>
</div>


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
                                    <label htmlFor="registration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type Carurant</label>
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



   
  </>
  )
}

export default Vehicules