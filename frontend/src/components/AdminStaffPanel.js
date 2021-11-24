import React, {useEffect, useState} from 'react';
import "../css/admin/staff.css"
import {makeAxiosGetRequest} from "../helper";
const AdminStaffPanel = (props) =>{

    const [allStaff,setAllStaff]=useState([])

    useEffect(()=>{
        makeAxiosGetRequest("/admin/getAllStaff",
            (err,response)=>{
            if(err)
                throw err

                setAllStaff(response)
            })
    },[])

    return(
        <div className="row-flex" id="staff-main-box">
            <div id="register-staff" className="col-flex-center">
                <div className="row-flex-center">

                    <form id="register-staff-form">
                        <div className="label-input-box">
                            <p className="label medium-text">Username</p>
                            <input type="text" name="username" className="medium-text"/>
                        </div>
                        <div className="label-input-box">
                            <p className="label medium-text">First Name</p>
                            <input type="text" name="first_name" className="medium-text"/>
                        </div>
                        <div className="label-input-box">
                            <p className="label medium-text">Last Name</p>
                            <input type="text" name="last_name" className="medium-text"/>
                        </div>

                        <div className="label-input-box">
                            <p className="label medium-text">Password</p>
                            <input type="password" name="password" id="staff-password" className="medium-text"/>
                        </div>

                        <div className="label-input-box">
                            <p className="label medium-text">Confirm Password</p>
                            <input type="password" id="staff-confirm-password" className="medium-text"/>
                        </div>

                        <div className="label-input-box">
                            <p className="label medium-text">Addiction Speciality</p>
                            <select id="addiction-speciality" name="speciality" className="medium-text"></select>
                        </div>
                        <p className="para-text" id="staff-add-err"></p>
                        <button id="submit-add-staff" className="classic-btn auto-left">Add Staff</button>
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
                            <td>{<a href={"/admin/staff/"+staff.id} className="classic-btn" target={"_blank"}>View</a>}</td>

                        </tr>
                        )
                    })}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default AdminStaffPanel;