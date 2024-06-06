import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { API_BACKEND } from '../../API/api'
import TableData from '../../components/TableData';
import { format } from 'date-fns'
import { useReparationsContext } from '../../hooks/useReparationsContext'

// icons 
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BiShowAlt } from "react-icons/bi";
const Reparations = () => {
    const { user } = useAuthContext()

    const {reparations ,dispatch } = useReparationsContext()

    
    const [search , setSearch] = useState("")
    const [filterData , setFilterDate] = useState([])

    const [reparationDetails, setReparationDetails] = useState(null);

    // modal 
    const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);

   

    useEffect(()=>{
        const fetchReparations = async ()=>{
            const response = await fetch(API_BACKEND +'/api/client/vehicule/reparations/' + user.id , {
                headers :{"Authorization" : `Bearer ${user.access_token}`}
            })
            const json = await response.json()
    
            if(response.ok){
                 dispatch({type : 'SET_REPARATIONS' , payload : json.data})
                 setFilterDate(json.data)

                console.log(json.data );
            }
    
        }

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


    const columns = [
        {
            name : "Photo",
            selector : (row) => <> <div className="flex-shrink-0 h-10 w-10">
                                       <img className="h-10 w-10 rounded-full" src={API_BACKEND +"/storage/" + row.photo} alt=""/>
                                  </div>
                                  </>,
            sortable: false
        },
      
        {
            name : "Matricule",
            selector : (row) => row.immatricule,
            sortable: true
        },

        {
            name : "Status",
            selector : (row) => row.pivot.status,
            sortable: true
        },
        {
            name: "Description",
            selector: (row) => {
                if (row.pivot.description.length > 10) {
                    return row.pivot.description.substring(0, 10) + "...";
                } else {
                    return row.pivot.description;
                }
            },
            sortable: true
        },
        {
            name: "Date Début",
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



        {
          name : "Actions",
          cell : (row) => <div className='flex items-center justify-center'>
                {/* <MdDelete onClick={()=> { deleteVehicule(row.id ) } } className="w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer mr-3" />
                <FaEdit onClick={()=> { modifierVehicule(row.id) }} className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mr-3" /> */}
                <BiShowAlt onClick={()=>{detailsReparation(row.id) }}  className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mr-3" />
      
          </div>
        }
      
      ] 

    const toggleModalDetails = ()=>{
        setIsModalDetailsOpen(!isModalDetailsOpen)
    }

    
    const detailsReparation = (id)=>{
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
                    title={"List Réparations"}   
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
                                src={API_BACKEND + "/storage/" + reparationDetails.photo}
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
                                        <li> Matricule : {reparationDetails.immatricule}</li>
                                        <li> Marque: {reparationDetails.marque}</li>
                                        <li> Model: {reparationDetails.model}</li>
                                        <li> Type Carburant: {reparationDetails.typeCarburant}</li>
                                    </ul>
                                    </dd>
                                </div>


                          


                              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Details Reparation </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    <li>Status : {reparationDetails.pivot.status}</li>
                                    <li>Date Début : {format( new Date( reparationDetails.pivot.start_date), "dd MMMM yyyy, HH:mm:ss")} </li>
                                    <li>Date Fin : {reparationDetails.pivot.end_date !== null ? format(new Date(reparationDetails.pivot.end_date), "dd MMMM yyyy, HH:mm:ss") : "NA"}</li>
                                    <li>description : {reparationDetails.pivot.description }</li>
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

export default Reparations