import React, { useEffect, useState } from 'react'
import { useClientsContext } from '../../hooks/useClientsContext'
import { format, set } from 'date-fns'
import TableData from '../../components/TableData'
import { useAuthContext } from '../../hooks/useAuthContext'
import { API_BACKEND } from '../../API/api'

import { MdModeEdit } from "react-icons/md";
import { useReparationsTermineContext } from '../../hooks/useReparationsTermineContext'

const GestionReparationTermine = () => {
    const {clients , dispatch:dispatchClients} = useClientsContext()
    const {reparations ,dispatch } = useReparationsTermineContext()
    const [search , setSearch] = useState("")
    const [filterData , setFilterDate] = useState([])
    const { user } = useAuthContext()

    const [reparationDetails, setReparationDetails] = useState(null);


    const [searchSelectMecanique , setSearchSelectMecanique] = useState("")
    const [mecaniqueVoitureEmail , setMecaniqueVoitureEmail] = useState("")
    const [idMecanique , setIdMecanique] = useState(null)
    const [idReparation , setIdReparation] = useState(null)
    const [dropDownMecaniques , setDropDownMecaniques] = useState(false)
    const [filterDataMecanique , setFilterDataMecanique] = useState([])

    const [error , setError] = useState("")

    // modal 

    const [isModalAffectationOpen , setIsModalAffectationOpen] = useState(false)
    const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);

    useEffect(()=>{
       
        const fetchReparations = async ()=>{
            const response = await fetch(API_BACKEND +'/api/admin/reparations/3' , {
                headers :{"Authorization" : `Bearer ${user.access_token}`}
            })
            const json = await response.json()
    
            if(response.ok){
                 dispatch({type : 'SET_REPARATIONS' , payload : json.data})
                 setFilterDate(json.data)

                console.log(json.data );
            }
    
        }

        const fetchMecaniciens = async ()=>{
            const response = await fetch(API_BACKEND +'/api/admin/mecaniciens' , {
                headers :{"Authorization" : `Bearer ${user.access_token}`}
            })
            const json = await response.json()
    
            if(response.ok){
                dispatchClients({type : 'SET_CLIENTS' , payload : json.data})
                setFilterDataMecanique(json.data)
            }
    
        }
    
        fetchMecaniciens()

        fetchReparations()
    
    } , [])

    useEffect(()=>{

        const result = reparations.filter((item)=>{
          return JSON.stringify(item)
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1
          
        });
      
       
        setFilterDate(result)
      
    } , [search ,reparations  ])

    useEffect(()=>{

        const result = clients.filter((item)=>{
          return JSON.stringify(item)
          .toLowerCase()
          .indexOf(searchSelectMecanique.toLowerCase()) !== -1
          
        });
      
       
        setFilterDataMecanique(result)
      
    } , [searchSelectMecanique ,clients  ])

    
    // toogle function 
    
    const toggleModalDetails = ()=>{
        setIsModalDetailsOpen(!isModalDetailsOpen)
    }


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
                 <button onClick={()=> { detailsItem(row.id) }}  className=' text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-xs px-1 py-0.5 text-center mr-1'>Afficher</button>
        
               
            </div>
        }
    
    ]

    //details

    const detailsItem = async(id)=>{
        const reparation =  reparations.filter(item=> item.id === id)[0]

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
                title={"Reparations Terminé"}   
                search={search} 
                setSearch={setSearch}
                transactions={false}

                />
            </div>
        </div>


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

                                <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicule</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                        <li> Matricule : {reparationDetails.vehicule.immatricule}</li>
                                        <li> Marque : {reparationDetails.vehicule.marque}</li>
                                        <li> Model : {reparationDetails.vehicule.model}</li>
                                        <li> Type Carburan t: {reparationDetails.vehicule.typeCarburant}</li>
                                    </ul>
                                    </dd>
                                </div>
                    

                            </div>
                          </div>
                
                          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                
                              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Client </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    <li>User Name : {reparationDetails.vehicule.user.userName}</li>
                                    <li>Email : {reparationDetails.vehicule.user.email} </li>
                                    <li>Address : {reparationDetails.vehicule.user.adress}</li>
                                    <li>Phone : {reparationDetails.vehicule.user.phone}</li>
                                    <li>Type : {reparationDetails.vehicule.user.role === 0 ? "Client" : "Mecanicien"}</li>
                                  </ul>
                                </dd>
                              </div>


                              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Mecanicien </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    <li>User Name : {reparationDetails.mecanicien.userName}</li>
                                    <li>Email : {reparationDetails.mecanicien.email} </li>
                                    <li>Address : {reparationDetails.mecanicien.adress}</li>
                                    <li>Phone : {reparationDetails.mecanicien.phone}</li>
                                    <li>Type : {reparationDetails.mecanicien.role === 0 ? "Client" : "Mecanicien"}</li>
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

export default GestionReparationTermine