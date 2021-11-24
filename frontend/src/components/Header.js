import {useEffect, useState} from "react";
import axios from "axios";
import {logoutUser, makeAxiosGetRequest} from "../helper";


const Header=(props)=> {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userType, setUserType] = useState("")
    useEffect(() => {
        makeAxiosGetRequest("/login/getLoginDetails", (err, response) => {
            if (err)
                throw err
            console.log(response)
            if (response.loggedIn) {
                setIsLoggedIn(true)
                setUserType(response.type)
            } else {
                setIsLoggedIn(false)

            }


        })
    }, [])
    return (
        <nav id="navigation-bar" className="row-flex">
            <a className="classic-btn" href="/" type="button">Logo</a>

            <div className="auto-left">
                {isLoggedIn ?
                    <>
                        {userType=="admin"?
                            <AdminLinks/>
                            :userType=="customer"?
                                <PatientLinks/>
                                :userType=="staff"?
                                    <StaffLinks/>
                                    :<></>}

                    <StaffLinks/>
                    <a className="classic-btn" onClick={logoutUser} type="button">Logout</a>
                    </>
                    :
                    <NotLoggedInLinks/>
                }
            </div>
        </nav>
    )
    }


const AdminLinks=(props)=>{
    return(
        <>
            <a className="classic-btn" href="/admin/staff" id="general-info-schedule">Staff</a>
            <a className="classic-btn" href="/admin/customer" id="general-info-reports">Customers</a>
        </>
    )
}

const StaffLinks=(props)=>{
    return(
        <>
        </>
    )
}

const PatientLinks=(props)=>{
    <>
    </>
}
const NotLoggedInLinks=(props)=>{
    return(
        <>
        <a className="classic-btn" href="/login" type="button">Login</a>
        </>
    )
}
export default Header