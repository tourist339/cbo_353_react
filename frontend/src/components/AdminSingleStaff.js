import React, {useEffect, useState} from 'react';
import {makeAxiosGetRequest, makeAxiosPostRequest} from "../helper";

const AdminSingleStaff = (props) => {

    const [result,setResult]=useState(false)
    const [staffInformmation,setStaffInformation]=useState({})
    const [searchUsername,setSearchUsername]=useState("")
    const [searchedPersonResponse,setSearchedPersonResponse]=useState({})
    const [listChanged,setListChanged]=useState("")
    useEffect(()=>{
        if(props.match){
            const index=props.match.params.index
            if(index){
                makeAxiosGetRequest("/admin/staff/"+index,(err,response)=>{
                    if(err)
                        throw err
                    console.log("Staff Information",response)
                    setResult(response.result)
                    setStaffInformation(response.data)
                })
            }
        }
    },[listChanged])

    const searchPatient=()=>{
        makeAxiosGetRequest("/admin/getSingleCustomerFromUsername?username="+searchUsername,(err,response)=>{
            console.log("Searched Person ",response)
            setSearchedPersonResponse(response)
        })
    }

    const addDoctorToPatient=()=>{
        const patientId=searchedPersonResponse.data.id
        const doctorId=staffInformmation.id
        makeAxiosPostRequest("/admin/addDoctorToPatient",{
            patientId:patientId,
            doctorId:doctorId
        },(err,response)=>{
            if(err)throw err
            console.log(response)
            setListChanged(listChanged+"1")
            setSearchedPersonResponse({})
            setSearchUsername("")

        })
    }

    const removePatientFromDoctor=(patientId)=>{
        const doctorId=staffInformmation.id
        makeAxiosPostRequest("/admin/removePatientFromDoctor",{
            patientId:patientId,
            doctorId:doctorId
        },(err,response)=>{
            if(err)throw err
            console.log("Removed Patient",response)
            setListChanged(listChanged+"1")
        })
    }

    return(

        <div className="col-flex" id="single-staff-main-box">
            <div id="update-staff">
                <p className="large-text underline">Staff Information</p>

                <form id="update-staff-form" className="row-flex">
                    <div className="label-input-box">
                        <p className="label medium-text">First Name</p>
                        <input type="text" id="first-name" value={staffInformmation.hasOwnProperty("firstname")?staffInformmation.firstname:""} name="first_name" className="medium-text" disabled/>
                    </div>
                    <div className="label-input-box">
                        <p className="label medium-text">Last Name</p>
                        <input type="text" id="last-name" value={staffInformmation.hasOwnProperty("lastname")?staffInformmation.lastname:""} name="last_name" className="medium-text" disabled/>
                    </div>

                    <div className="label-input-box">
                        <p className="label medium-text">Addiction Speciality</p>
                        <input id="addiction-speciality" value={staffInformmation.hasOwnProperty("addiction_type")?staffInformmation.addiction_type:""}  name="speciality" className="medium-text"disabled/>
                    </div>
                </form>
                <p className="para-text" id="staff-add-err"></p>
            </div>
            <div id="add-patient">
                <p className="large-text underline">Add Patient</p>
                <form id="add-patient-form" className="row-flex">
                    <div className="label-input-box row-flex">
                        <p className="label medium-text">Username:</p>
                        <input type="text" value={searchUsername} onChange={e=>setSearchUsername(e.target.value)} id="review-patient-username" className="medium-text"/>
                    </div>
                    <input type="button" onClick={searchPatient} id="review-patient-btn" className="classic-btn" value="Review"/>
                </form>

                <div id="searched-patient-box">
                    {searchedPersonResponse.hasOwnProperty("result")?
                    searchedPersonResponse.result?
                        <div className={"row-flex"}>
                            <p style={{marginRight:"10px"}} className={"medium-text"}> {searchedPersonResponse.data.firstname}</p>
                            <p style={{marginRight:"10px"}} className={"medium-text"}> {searchedPersonResponse.data.lastname}</p>
                            <p style={{marginRight:"10px"}} className={"medium-text"}> {searchedPersonResponse.data.addiction_type}</p>
                            <button className={"medium-text classic-btn"} onClick={addDoctorToPatient}>Add</button>

                        </div>
                        :
                        <p className={"medium-text"}>{searchedPersonResponse.data}</p>
                        :<></>
                    }

                </div>
            </div>
            <div id="all-patients">
                <p className="large-text underline">Patients Assigned</p>

                    {staffInformmation.hasOwnProperty("customers") ?
                        staffInformmation.customers.length > 0 ?
                            <table id="all-patients-table">

                            <tbody>
                            <tr>

                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone Number</th>

                                <th>Links</th>
                            </tr>
                            {staffInformmation.customers.map(
                                customer=>{
                                    return(
                                        <tr key={customer.id}>
                                            <td>{customer.firstname}</td>
                                            <td>{customer.lastname}</td>
                                            <td>{customer.phone_num}</td>

                                            <td>
                                                <button className="remove-patient-from-doctor classic-btn"
                                                        onClick={()=>removePatientFromDoctor(customer.id) }>Remove
                                                </button>
                                            </td>

                                        </tr>
                                    )}
                            )
                            }
                            </tbody>
                        </table>

                        : <p className={"large-text"}>There are no Patients</p>
                        :<></>
                    }
            </div>
        </div>

)
}

export default AdminSingleStaff;