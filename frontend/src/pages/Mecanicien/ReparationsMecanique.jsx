import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useReparationsMecaniqueContext } from '../../hooks/useReparationsMecaniqueContext'
import { API_BACKEND } from '../../API/api'
import TableData from '../../components/TableData'


import { format } from 'date-fns'

import { BiShowAlt } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";
import { GiAutoRepair } from "react-icons/gi";


const ReparationsMecanique = () => {

    const { user } = useAuthContext()
    const {reparationsMecanique ,dispatch } = useReparationsMecaniqueContext()
    const [search , setSearch] = useState("")
    const [filterData , setFilterDate] = useState([])

    const [reparationDetails, setReparationDetails] = useState(null);
    const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);
    // reaparations 

    const [isModalReparationOpen , setIsModalReparationOpen] = useState(false)
    const [reparationR , setReparationR] = useState(null)


    // error 

    const [error , setError] = useState("")
 

    useEffect(()=>{
        const fetchReparations = async ()=>{
            const response = await fetch(API_BACKEND +'/api/mecanicien/reparations/' + user.id , {
                headers :{"Authorization" : `Bearer ${user.access_token}`}
            })
            const json = await response.json()
    
            if(response.ok){
                 dispatch({type : 'SET_REPARATIONS' , payload : json.data})
                 setFilterDate(json.data)

                 console.log(json.data);

                console.log(json.data );
            }
    
        }

        fetchReparations()
    
    } , [])

    useEffect(()=>{

        const result = reparationsMecanique.filter((item)=>{
          return JSON.stringify(item)
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1
          
        });
      
       
        setFilterDate(result)
      
    } , [search ,reparationsMecanique  ])

    

    const columns = [
    {
        name : "Photo",
        selector : (row) => <> <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-full" src={API_BACKEND +"/storage/" + row.vehicule.photo} alt=""/>
                                </div>
                                </>,
        sortable: false
    },
    
    {
        name : "Matricule",
        selector : (row) => row.vehicule.immatricule,
        sortable: true
    },

    {
        name : "Status",
        selector : (row) => row.status,
        sortable: true
    },
    {
        name: "Description",
        selector: (row) => {
            if (row.description.length > 10) {
                return row.description.substring(0, 10) + "...";
            } else {
                return row.description;
            }
        },
        sortable: true
    },
    {
        name: "Date Début",
        selector: (row) =>   format( new Date( row.start_date), "dd MMMM yyyy, HH:mm:ss"),
        sortable: true
    },
    {
        name: "Date Fin",
        selector: (row) => {
            if (row.end_date !== null) {
                return format(new Date(row.end_date), "dd MMMM yyyy, HH:mm:ss");
            } else {
                return "N/A"; 
            }
        },
            
        sortable: true
    },



    {
        name : "Actions",
        cell : (row) => <div className='flex items-center justify-center'>
            {/* <MdDelete onClick={()=> { deleteVehicule(row.id ) } } className="w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer mr-3" />
            <FaEdit onClick={()=> { modifierVehicule(row.id) }} className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mr-3" /> */}
            <BiShowAlt onClick={()=>{detailsReparation(row.id) }}  className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mr-3" />
            <GiAutoRepair onClick={()=>reparationVehicule(row.id)}  className='w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mr-3' />
    
        </div>
    }
    
    ] 

    // toogle functons 

    const toggleModalReparation = ()=>{
        setIsModalReparationOpen(!isModalReparationOpen)
    }

    const toggleModalDetails = ()=>{
        setIsModalDetailsOpen(!isModalDetailsOpen)
    }


    // reparation vehicule 
    const reparationVehicule = (id)=>{
        const rep = reparationsMecanique.filter((item)=> item.id === id)[0]
        setReparationR(rep)
        setIsModalReparationOpen(true)
    }


    // fin Reparation 

    const finReparation = async()=>{
        const formData = new FormData();
        formData.append('mecanique_id', user.id);

        const response = await fetch(API_BACKEND + '/api/mecanicien/reparation/fin/' + reparationR.id , {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${user.access_token}`,
               // "Accept": "application/json" 
            },
            body: formData
        });
  
        const json = await response.json()

        

        if(!response.ok){
            setError(json.error)
        }

        if(response.ok){
           
            dispatch({ type: 'UPDATE_REPARATION', payload:  json.data });

            setIsModalReparationOpen(false)
        }
    }


    // details  Reparation 

    const detailsReparation = (id)=>{
        const reparation =  reparationsMecanique.filter(item=> item.id === id)[0]

        console.log(reparation);

        setReparationDetails(reparation)

      
       
        setIsModalDetailsOpen(true)
    }




  return (
    <>
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                <TableData 
                    dataTab={filterData} 
                    columns={columns} 
                    title={"List Reparations"}   
                    search={search} 
                    setSearch={setSearch}
                    transactions={false}

                />

            </div>
        </div>


         {/* Reparation Vehicule  */}

    {isModalReparationOpen && (
                    
        <div id="crud-modal" tabIndex="2" aria-hidden="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
            <div className="relative p-4 w-full max-w-2xl max-h-screen bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Reparation Vehicule
                    </h3>
                    <button onClick={toggleModalReparation} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* {errorAdd && <div className='text-red-700 text-center mt-2'> {errorAdd}</div>} */}

                <form className="p-4 md:p-5"  encType="multipart/form-data">
                

                    <div className="mb-4">
                        <div className="bg-white overflow-hidden shadow rounded-lg border ">
                            <div className="px-4 py-5 sm:px-6">
                                <div className="mb-4 flex justify-center items-center">
                                    <img
                                        src={API_BACKEND + "/storage/" + reparationR.vehicule.photo}
                                        className="h-auto max-w-40 rounded-lg"
                                        alt=""
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Matricule
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {reparationR.vehicule.immatricule}
                                        </dd>
                                    </div>

                                    <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Marque
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {reparationR.vehicule.marque}
                                        </dd>
                                    </div>

                                    <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Model
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {reparationR.vehicule.model}
                                        </dd>
                                    </div>

                                    <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Type Carburant
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {reparationR.vehicule.typeCarburant}
                                        </dd>
                                    </div>
                                
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* butthons */}
                    <div className="p-2 md:p-2 text-center">

                        {reparationR.end_date === null && 
                            <button onClick={finReparation} data-modal-hide="popup-modal" type="button" className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Fin Reparation
                            </button>
                        }
                    
                        
                        <button onClick={toggleModalReparation} data-modal-hide="popup-modal" type="button" className="py-2.5 px-9 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Fermer</button>
                    </div>



                    {/* <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Ajouter
                    </button> */}
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Details Reparation</h3>
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
                            <div className="mb-4 flex flex-col justify-center items-center">
                              <img
                                src={API_BACKEND + "/storage/" + reparationDetails.vehicule.photo}
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
                                        <li> Matricule : {reparationDetails.vehicule.immatricule}</li>
                                        <li> Marque: {reparationDetails.vehicule.marque}</li>
                                        <li> Model: {reparationDetails.vehicule.model}</li>
                                        <li> Type Carburant: {reparationDetails.vehicule.typeCarburant}</li>
                                    </ul>
                                    </dd>
                                </div>


                          


                              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Details Reparation </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    <li>Status : {reparationDetails.status}</li>
                                    <li>Date Début : {format( new Date( reparationDetails.start_date), "dd MMMM yyyy, HH:mm:ss")} </li>
                                    <li>Date Fin : {reparationDetails.end_date !== null ? format(new Date(reparationDetails.end_date), "dd MMMM yyyy, HH:mm:ss") : "NA"}</li>
                                    <li>description : {reparationDetails.description }</li>
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

export default ReparationsMecanique