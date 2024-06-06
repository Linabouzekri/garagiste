import React, { useEffect, useState } from 'react'
import TableData from '../../components/TableData'
import { useReparationsContext } from '../../hooks/useReparationsContext'
import { BiShowAlt } from 'react-icons/bi'
import { AiFillCheckCircle } from 'react-icons/ai'
import { useAuthContext } from '../../hooks/useAuthContext'
import { API_BACKEND } from '../../API/api'
import { format, set } from 'date-fns'
import { useClientsContext } from '../../hooks/useClientsContext'

const GestionReparationEnAttenete = () => {
    const {clients , dispatch:dispatchClients} = useClientsContext()
    const {reparations ,dispatch } = useReparationsContext()
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
            const response = await fetch(API_BACKEND +'/api/admin/reparations/1' , {
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


    // toogle functions 

    const toggleDropDownMecanique = ()=>{
        setDropDownMecaniques(!dropDownMecaniques)
    }

    const toggleModalAffectation = ()=>{
        setIsModalAffectationOpen(!isModalAffectationOpen)
    }
    
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
             <button onClick={()=> { detailsItem(row.id) }}  className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-xs px-1 py-0.5 text-center mr-1'>Afficher</button>
    
            <button onClick={ ()=>{affecterReparationToMecanique(row.id)}}  className='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:outline-none font-medium rounded-lg text-xs px-1 py-0.5 text-center'>affecter</button>
    
        </div>
    }

    ] 


    // affect reparation Mecanique  

    const affecterReparationToMecanique = (id)=>{
        setIsModalAffectationOpen(true)
        setMecaniqueVoitureEmail("")
        setIdMecanique(null)
        setIdReparation(id)
        setError("")


    }

    const handleAffectReparationMecaniqueSubmit = async(e)=>{
        
        e.preventDefault();

        const formData = new FormData();
        formData.append('mecanique_id', idMecanique);
        formData.append('idReparation' , idReparation)

        const response = await fetch(API_BACKEND + '/api/admin/reparation/affecte' , {
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
            console.log(json.data);
           
            dispatch({ type: 'DELETE_REPARATION', payload:  idReparation});

            setIsModalAffectationOpen(false)
        }

        console.log(idMecanique);

    }

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
        {filterData &&

            <TableData 
              dataTab={filterData} 
              columns={columns} 
              title={" Liste Reparations En Attente"}   
              search={search} 
              setSearch={setSearch}
              transactions={false}

            />
        }
            
        </div>
    </div>

      {/* affect reparation Mecanique */}

      {isModalAffectationOpen && (
                <div id="crud-modal" tabIndex="2" aria-hidden="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                    <div className="relative p-2 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto">
                        <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Ajouter Reparation
                            </h3>
                            <button onClick={toggleModalAffectation} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {error && <div className='text-red-700 text-center mt-2'>{error}</div>}

                        <form className="p-2 md:p-5" onSubmit={handleAffectReparationMecaniqueSubmit} encType="multipart/form-data">
                            

                            <div className="flex">
                                <div className="w-1/4"> 
                                    <button onClick={toggleDropDownMecanique} id="dropdownUsersButton" data-dropdown-toggle="dropdownUsers" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                        liste Mecaniciens 
                                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="ml-3 w-3/4"> 
                                    <input value={mecaniqueVoitureEmail} type="email" name="client" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="email Mecanicien " required readOnly /> 
                                </div>
                            </div>

                            {dropDownMecaniques && 
                                <div id="dropdownUsers" className="z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                                    <div className="p-3">
                                        <label htmlFor="input-group-search" className="sr-only">Search</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                </svg>
                                            </div>
                                            <input value={searchSelectMecanique} onChange={(e) => setSearchSelectMecanique(e.target.value)} type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Client" />
                                        </div>
                                    </div>
                                    <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                        {filterDataMecanique && filterDataMecanique.map((item, index) => (
                                            <li key={index}>
                                                <a onClick={() => { 
                                                        setIdMecanique(item.id)
                                                        setMecaniqueVoitureEmail(item.email)
                                                        setDropDownMecaniques(false)
                                                    }} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    {item.email}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }


                            <div className="flex items-center justify-center h-full mt-8">
                                <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Affecter
                                </button>
                            </div>

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

                                <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Vehicule</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                        <li> Matricule : {reparationDetails.vehicule.immatricule}</li>
                                        <li> Marque : {reparationDetails.vehicule.marque}</li>
                                        <li> Model : {reparationDetails.vehicule.model}</li>
                                        <li> Type Carburant : {reparationDetails.vehicule.typeCarburant}</li>
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
                                <dt className="text-sm font-medium text-gray-500">Details Reparation </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    <li>Status : {reparationDetails.status}</li>
                                    <li> Date Début : {format( new Date( reparationDetails.start_date), "dd MMMM yyyy, HH:mm:ss")} </li>
                                    <li> Date  Fin : {reparationDetails.end_date !== null ? format(new Date(reparationDetails.end_date), "dd MMMM yyyy, HH:mm:ss") : "NA"}</li>
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

export default GestionReparationEnAttenete