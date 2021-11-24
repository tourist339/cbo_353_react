import React, {useEffect, useState} from 'react';
import "../css/admin/staff.css"
import {makeAxiosGetRequest, makeAxiosPostRequest} from "../helper";
import AddictionSelectBox from "./AddictionSelectBox";
const AdminStaffPanel = (props) =>{

    const [allStaff,setAllStaff]=useState([])

    useEffect(()=>{
        reloadStaff()
    },[])
    const reloadStaff=()=>{
        makeAxiosGetRequest("/admin/getAllStaff",
            (err,response)=>{
                if(err)
                    throw err

                setAllStaff(response)
            })
    }
    const deleteStaff=(staffId)=>{
        makeAxiosPostRequest("/admin/deleteStaff",{
            staffId:staffId
        },(err,response)=>{
            if(response.result)reloadStaff()
        })
    }

    return(
        <div className="row-flex" id="staff-main-box">
            <div id="register-staff" className="col-flex-center">
                <div className="row-flex-center">

                    <form id="register-staff-form">
                     <RegisterUserForm onSubmit={()=>reloadStaff()}></RegisterUserForm>
                    </form>
                </div>
            </div>
            <div id="all-staff">
                <p className="large-text" style={{margin: "0px",textAlign: "center"}}>All Staff</p>
                <table id="all-staff-table">
                    <tbody>
                    <tr>
                        <th>Username</th>

                        <th>Name</th>
                        <th>Speciality</th>
                        <th>Link</th>

                    </tr>
                    {allStaff.map(staff=>{
                        return(
                        <tr>
                            <td>{staff.username}</td>
                            <td>{staff.firstname+" "+staff.lastname}</td>
                            <td>{staff.addiction_type}</td>
                            <td>
                                <a href={"/admin/staff/"+staff.id} className="classic-btn" target={"_blank"}>View</a>
                                <button className="classic-btn" onClick={()=>deleteStaff(staff.id)}>Delete</button>

                            </td>

                        </tr>
                        )
                    })}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

const RegisterUserForm=(props)=>{
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [addiction,setAddiction]=useState("")
    const [passwordsMatch,setPasswordsMatch]=useState(true)

    const registerUser=()=>{
        makeAxiosPostRequest("/admin/registerStaff",{
            username:username,
            first_name:firstName,
            last_name:lastName,
            speciality:addiction,
            password:password,

        },(err,data)=>{
            if(err)throw err
            console.log(data)
            if(data.result){
                setFirstName("")
                setLastName("")
                setPassword("")
                setUsername("")
                props.onSubmit()
            }
        })
    }



    return(
        <>
            <div className="label-input-box">
                <p className="label medium-text">Username</p>
                <input id="username" onChange={e=>setUsername(e.target.value)} name="username" type="text" className="medium-text"/>
            </div>


            <div className="label-input-box">
                <p className="label medium-text">Password</p>
                <input id="password" onChange={e=>setPassword(e.target.value)} name="password" type="password" className="medium-text"/>
            </div>

            <div className="label-input-box">
                <p className="label medium-text">Confirm Password</p>
                <input id="confirm-password" onChange={e=>{setPasswordsMatch(e.target.value==password)}} type="password" className="medium-text"/>
                {!passwordsMatch?<p className={"para-text"}>Passwords do not match</p>:<></>}
            </div>

            <div className="label-input-box">
                <p className="label medium-text">First Name</p>
                <input type="text" onChange={e=>setFirstName(e.target.value)} name="first_name" className="medium-text"/>
            </div>
            <div className="label-input-box">
                <p className="label medium-text">Last Name</p>
                <input type="text" onChange={e=>setLastName(e.target.value)} name="last_name" className="medium-text"/>
            </div>


            <div className="label-input-box">
                <p className="label medium-text">Addiction Speciality?</p>
                <AddictionSelectBox onChange={(selection) => setAddiction(selection)}/>
            </div>

            <input type={"button"} style={{margin:"10px auto",width:"100px"}} onClick={registerUser} className={"medium-text classic-btn"} value={"Submit"}/>

        </>
    )
}

export default AdminStaffPanel;