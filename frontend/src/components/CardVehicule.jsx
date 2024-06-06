import React, { useEffect, useRef, useState } from 'react'

import { API_BACKEND, API_FRONTEND } from '../API/api'

import { MdDelete } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { MdCarRepair } from "react-icons/md";
import { useVehiculesContext } from '../hooks/useVehiculesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import TableData from './TableData';
import { format, set } from 'date-fns'
const CardVehicule = ( {vehicule }) => {
    
    const {vehicules , dispatch} = useVehiculesContext()
    const { user } = useAuthContext()
    
    const picREf = useRef()
    const [previewImage, setPreviewImage] = useState(API_FRONTEND + '/src/Images/vehicule2.png');

    // models 
    const [isModalDeleteOpen , setIsModalDeleteOpen] = useState(false)
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalReparationOpen , setIsModalReparationOpen] = useState(false)
    const [isModalDetailsOpen , setIsModalDetailsOpen] =useState(false)

    // vehicule
    const [photo, setPhoto] = useState(null);
    const [marque, setMarque] = useState('');
    const [model, setModel] = useState('');
    const [typeCarburant, setTypeCarburant] = useState('');
    const [immatricule, setImmatricule] = useState('');

    // reparation 
    const [description , setDescription] = useState("")

    // data table  
    const [filterDataReparation , setFilterDataReparation] =useState(vehicule.reparations )
    const [searchReparation , setSearchReparation] = useState("")

    
    const columnsReparations = [

        {
            name : "Status",
            selector : (row) => row.pivot.status,
            sortable: true
        },
        
        {
            name : "Description",
            selector : (row) => row.pivot.description,
            sortable: true
        },
        {
            name: " Date Début",
            selector: (row) =>   format( new Date( row.pivot.start_date), "dd MMMM yyyy, HH:mm:ss"),
            sortable: true
        },
        {
            name: "Date Fin",
            selector: (row) => {
                if (row.pivot.end_date !== null) {
                    return format(new Date(row.pivot.end_date), "dd MMMM yyyy, HH:mm:ss");
                } else {
                    return "N/A"; 
                }
            },
                
            sortable: true
        },
    
    
    
    ] 
    
    // error 
    const [errorDelete ,  setErrorDelete] = useState("")
    const [ errorUpdate , setErrorUpdate] = useState("")
    const [errorReparation , setErrorReparation] = useState("")

    const clickImage=()=>{
        picREf.current.click();
        
    }

    useEffect(()=>{

        const result = vehicule.reparations.filter((item)=>{
          return JSON.stringify(item)
          .toLowerCase()
          .indexOf(searchReparation.toLowerCase()) !== -1
          
        });
      
       
        setFilterDataReparation(result)
      
    } , [searchReparation ,vehicule.reparations  ])

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

    const handleChangedescription = (e)=>{
        setDescription(e.target.value)
    }

    
    // toggle functions 
   
    const toggleModalDelete = () => {
        setIsModalDeleteOpen(!isModalDeleteOpen);
    };

    const toggleModalUpdate = () => {
        setIsModalUpdateOpen(!isModalUpdateOpen);
    };

    const toogleModalReparation = ()=>{
        setIsModalReparationOpen(!isModalReparationOpen)
    }

    const toggleModalDetails = ()=>{
        setIsModalDetailsOpen(!isModalDetailsOpen)
    }

    
    // delete vehicule 

    const deleteVehicule= async() =>{

        setIsModalDeleteOpen(true)
        setErrorDelete("")
    }

    
    const handleDeleteVehiculeSubmit = async(e)=>{
        e.preventDefault();
        try{

        
        const response = await fetch( API_BACKEND+ "/api/client/vehicule/" + vehicule.id, {
            method : 'DELETE' , 
            headers : {"Content-type" : 'application/json'},
            
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

     // update Vehicule 

    const modifierVehicule = async() =>{
        setErrorUpdate("")
        setIsModalUpdateOpen(true)

        setMarque(vehicule.marque)
        setModel(vehicule.model)
        setImmatricule(vehicule.immatricule) 
        setTypeCarburant(vehicule.typeCarburant)

    }

    const handleUpdateVehiculeSubmit = async(e)=>{
        e.preventDefault()

        const formData = new FormData();
        formData.append('marque', marque);
        formData.append('photo', photo);
        formData.append('typeCarburant', typeCarburant);
        formData.append('immatricule', immatricule);
        formData.append('model', model);
        formData.append('user_id' , user.id)

  


        const response = await fetch(API_BACKEND + '/api/client/vehicule/' + vehicule.id,  {
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
            setPhoto(null)
            setPreviewImage(API_FRONTEND + '/src/Images/vehicule2.png')
        }
    }
    

    // repartion vehicule 

    const reparationVehicule = ()=>{
        setErrorReparation("")
        setIsModalReparationOpen(true)
    }

    const handleSubmitReparation = async (e)=>{
        e.preventDefault()

        console.log("description" , description);

        const formData = new FormData();
        formData.append('description', description);
        
        const response = await fetch(API_BACKEND + '/api/client/demendeReparation/'+ vehicule.id , {
            method: 'POST',
            headers: { "Authorization": `Bearer ${user.access_token}` },
            body: formData
        });
  
          const json = await response.json()

          console.log(json);
  
          if(!response.ok){
  
              setErrorReparation(json.error)
  
          }
  
          if(response.ok){
        
            setIsModalReparationOpen(false)
            setDescription("")
          }
    }

    // details Vehicule

    const datailsVehicule = ()=>{
        console.log(vehicule);
        setIsModalDetailsOpen(true)
    }

  return (
    <>
    <article className="bg-white  p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border">
                <div className="relative mb-4 rounded-2xl">
                    <img className="max-h-36 w-full h-80 rounded-2xl  transition-transform duration-300 transform group-hover:scale-105"
                        src={API_BACKEND + "/storage/" + vehicule.photo} alt="" />

                    <a className="flex justify-center items-center bg-red-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                       onClick={datailsVehicule} target="_self" rel="noopener noreferrer">
                        details
                        <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>

                <div className="flex justify-between items-center w-full pb-4 mb-auto">

                    </div>
                        <p className="text-sm text-gray-500" ><span className="text-sm font-semibold " > Marque :</span> {vehicule.marque}</p>
                        <p className="text-sm text-gray-500" ><span className="text-sm font-semibold " > Model :</span> {vehicule.model}</p>
                        <p className="text-sm text-gray-500" ><span className="text-sm font-semibold " > Numero immatricule :</span> {vehicule.immatricule}</p>
                        <p className="text-sm text-gray-500" ><span className="text-sm font-semibold " > Type Carburant :</span> {vehicule.typeCarburant}</p>
                   
                    <div>

                    <div className='mt-2'>
                        <button  onClick={()=>{deleteVehicule()}}  className='text-red-500 '><MdDelete className='size-8' /></button>
                        <button onClick={()=>{modifierVehicule()}}  className='text-blue-500 '><MdEditSquare className="size-8" /></button>
                        <button onClick={()=>{reparationVehicule()}}  className='text-green-500 '><MdCarRepair  className="size-8" /></button>

                        
                    </div>
                       
                </div>
                
    </article>




    {/* Delete */}
    {isModalDeleteOpen &&
        <div id="deleteModal" className="z-50 fixed inset-0 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
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


    {/* update Vehicule  Modal */}
    {isModalUpdateOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Update Vehicule
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
                                            <label htmlFor="fulType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nemuro Immatricule</label>
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


{isModalReparationOpen && 
     <div id="crud-modal" tabIndex="2" aria-hidden="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
     <div className="relative p-2 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto">
         <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                 Ajoutre Reparations
             </h3>
             <button onClick={toogleModalReparation} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                 <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                 </svg>
                 <span className="sr-only">Close modal</span>
             </button>
         </div>
         {errorReparation && <div className='text-red-700 text-center mt-2'>{errorReparation}</div>}

         <form className="p-2 md:p-5" onSubmit={handleSubmitReparation}  encType="multipart/form-data">

                <div className="grid gap-4 mb-4 grid-cols-2 mt-2">
                    
                    <div className="col-span-2">
                        <label htmlFor="description" className="float-start block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Description</label>
                        <textarea id="description" value={description} onChange={handleChangedescription} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write description repairing here"></textarea>                    
                    </div>
                    
                </div>

             <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                 Ajouter
             </button>
         </form>
     </div>
 </div>


}


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
                  src={API_BACKEND + "/storage/" + vehicule.photo}
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
                      <li className="flex"><span className="mr-2">Matricule</span>: {vehicule.immatricule}</li>
                      <li className="flex"><span className='mr-2'>Marque</span>: {vehicule.marque}</li>
                      <li className="flex"><span className='mr-2'>Model</span>: {vehicule.model}</li>
                      <li className="flex"><span className='mr-2'>Type Carburant</span>: {vehicule.typeCarburant}</li>
                    </ul>
                  </dd>
                </div>


             



              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5 overflow-y-auto">
        <TableData
          dataTab={filterDataReparation}
          columns={columnsReparations}
          title={"List Reparations"}
          search={searchReparation}
          setSearch={setSearchReparation}
          transactions={false}
        />
      </div>
    </div>
  </div>
)}




        


</>
  )
}

export default CardVehicule