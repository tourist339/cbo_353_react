import React, {useEffect, useState} from 'react';
import "../css/admin/customer.css"
import {makeAxiosGetRequest, makeAxiosPostRequest} from "../helper";
const AdminCustomersPanel = (props) => {
    const [allCustomers,setAllCustomers]=useState([])
    const [openedAssignBoxes,setOpenedAssignBoxes]=useState({})
    const [updated,setUpdated]=useState("")
    const [seachCustomerUsername,setSearchCustomerUsername]=useState("")
    useEffect(()=>{
        makeAxiosGetRequest("/admin/getAllCustomers",(err,response)=>{
            console.log(response)
            const result= response.filter((customer)=>{
                return customer.username.includes(seachCustomerUsername)
            })
            setAllCustomers(result)
        })
    },[updated,seachCustomerUsername])

    const toggleBox=(boxIndex)=>{
         let currentAssignBoxes={...openedAssignBoxes}
        if(currentAssignBoxes.hasOwnProperty(boxIndex)){
            delete currentAssignBoxes[boxIndex]
        }else{
            currentAssignBoxes[boxIndex]= {searchedDoctorUsername:"",searchedDoctorData:{}}
        }
        console.log(currentAssignBoxes)

        setOpenedAssignBoxes(currentAssignBoxes)
    }

    const searchDoctor=(boxIndex)=>{
        const doctorUsername=openedAssignBoxes[boxIndex].searchedDoctorUsername
        makeAxiosGetRequest("/admin/getSingleStaffFromUsername?username="+doctorUsername,(err,response)=>{
            console.log(response)
            let currentAssignBoxes={...openedAssignBoxes}
            currentAssignBoxes[boxIndex].searchedDoctorData=response
            setOpenedAssignBoxes(currentAssignBoxes)
        })
    }

    const changeSearchDoctorUsername=(e,boxIndex)=>{
        let currentAssignBoxes={...openedAssignBoxes}
        let newUsername=e.target.value
        currentAssignBoxes[boxIndex].searchedDoctorUsername=newUsername
        console.log(currentAssignBoxes)
        setOpenedAssignBoxes(currentAssignBoxes)

    }
    const addDoctorToPatient=(boxIndex)=>{
        const patientId=allCustomers[boxIndex].id
        const doctorId=openedAssignBoxes[boxIndex].searchedDoctorData.data.id
        makeAxiosPostRequest("/admin/addDoctorToPatient",{
            patientId:patientId,
            doctorId:doctorId
        },(err,response)=>{
            if(err)throw err
            if(response.result) {
                setUpdated(updated + "1")
                toggleBox(boxIndex)
            }


        })
    }

    const deleteCustomer=(boxIndex)=>{
        let customerId=allCustomers[boxIndex].id
        makeAxiosPostRequest("/admin/deleteCustomer",{
            customerId:customerId
        },(err,response)=>{
            console.log(response)
            setUpdated(updated+"d")
        })
    }

    const removeDoctorFromPatient=(boxIndex)=>{
        const patientId=allCustomers[boxIndex].id
        const doctorId=allCustomers[boxIndex].doctor.id
        makeAxiosPostRequest("/admin/removePatientFromDoctor",{
            patientId:patientId,doctorId:doctorId
        },(err,response)=>{
            console.log(response)
            setUpdated(updated+"r")
        })


    }

    return(
        <div id="all-customers">
            <div className="row-flex label-input-box" id="seach-person-box">
                <p className="label medium-text">Search Person by username</p>
                <input type="text" className="medium-text" value={seachCustomerUsername} onChange={e=>setSearchCustomerUsername(e.target.value)} id="input-search-text" placeholder="Enter username here"/>
            </div>
            <table id="all-customers-table">
                <tbody>
                <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Addiction Kind</th>
                    <th>Phone Number</th>

                    <th>Doctor</th>

                    <th>Links</th>
                </tr>

                {allCustomers.map((customer,index)=>{
                    return(
                        <React.Fragment key={customer.id}>
                        <tr>
                            <td>{customer.username}</td>

                            <td>{customer.firstname}</td>

                            <td>{customer.lastname}</td>
                            <td>{customer.phone_num}</td>

                            <td>{customer.addiction_type}</td>

                            <td>{customer.doctor?
                                <>{customer.doctor.firstname}<button className={"medium-text classic-btn"} onClick={()=>removeDoctorFromPatient(index)}>Remove</button></>
                                :
                                <>No doctor yet <button className={"medium-text classic-btn"} onClick={()=>toggleBox(index)}>Assign</button></>
                            }</td>
                            <td>
                                <button className="classic-btn delete-customer-btn" onClick={()=>deleteCustomer(index)}>Delete</button></td>

                        </tr>
                            {openedAssignBoxes.hasOwnProperty(index)?

                                <tr >
                            <td className={`${openedAssignBoxes.hasOwnProperty(index)?"":"hidden"}`} colSpan="6">
                                <div  className="assign-doctor-box">
                                    <div className="row-flex label-input-box" >
                                        <p className="label medium-text">Doctor Username: </p>
                                        <input type="text" value={openedAssignBoxes[index].searchedDoctorUsername} onChange={e=>changeSearchDoctorUsername(e,index)} className="medium-text search-doctor-input" id="search-doctor-input-${index}" placeholder="Enter username here"/>
                                    </div>
                                    <input  type="button"  value="Search" onClick={()=>searchDoctor(index)} className="classic-btn search-doctor-btn"/>

                                    <div className="searched-doctor-box">
                                        {openedAssignBoxes[index].searchedDoctorData.hasOwnProperty("result") ?
                                            openedAssignBoxes[index].searchedDoctorData.result
                                                ?<>
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Speciality</th>
                                                        <th>Number of Patients</th>
                                                        <th>Link</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{openedAssignBoxes[index].searchedDoctorData.data.firstname}</td>
                                                        <td>{openedAssignBoxes[index].searchedDoctorData.data.lastname}</td>
                                                        <td>{openedAssignBoxes[index].searchedDoctorData.data.addiction_type}</td>
                                                        <td>{openedAssignBoxes[index].searchedDoctorData.data.customers.length}</td>
                                                        <td><button className={"classic-btn medium-text"} onClick={()=>addDoctorToPatient(index)}>Add</button></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                </>
                                                :
                                                <p className={"medium-text"}>No staff with the username exists</p>
                                            :<></>
                                        }
                                        </div>
                                </div>
                            </td></tr>:<></>}
                        </React.Fragment>
                    )
                })}
                </tbody>

            </table>
        </div>

)
}

export default AdminCustomersPanel;