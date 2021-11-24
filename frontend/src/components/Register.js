import React, {useState} from 'react';
import AddictionSelectBox from "./AddictionSelectBox";
import {makeAxiosPostRequest} from "../helper";

const Register = (props) =>{

    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,seConfirmPassword]=useState("")
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [phoneNum,setPhoneNum]=useState("")
    const [addiction,setAddiction]=useState("")
    const [passwordsMatch,setPasswordsMatch]=useState(true)

    const registerUser=()=>{
        makeAxiosPostRequest("/registerCustomer",{
            username:username,
            first_name:firstName,
            last_name:lastName,
            phone_num:phoneNum,
            password:password,
            addiction_kind:addiction

        },(err,data)=>{
            if(err)throw err
            if(data.result){
                window.location.reload()
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
                <p className="label medium-text">Phone Number</p>
                <input type="text" onChange={e=>setPhoneNum(e.target.value)} name="phone_num" className="medium-text"/>
            </div>

            <div className="label-input-box">
                <p className="label medium-text">What kind addiction you need help with?</p>
                <AddictionSelectBox onChange={(selection) => setAddiction(selection)}/>
            </div>

            <input type={"button"} style={{margin:"10px auto",width:"100px"}} onClick={registerUser} className={"medium-text classic-btn"} value={"Submit"}/>

        </>
    )
}

export default Register;