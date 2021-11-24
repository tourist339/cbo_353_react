import React, {useEffect, useState} from 'react';
import {isUserLoggedIn, makeAxiosGetRequest, makeAxiosPostRequest} from "../helper";

const Login = (props) =>{
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [loggedIn,setLoggedIn]=useState(false)
    useEffect(()=> {
        console.log("Rewrw")
            isUserLoggedIn((result, data) => {
                setLoggedIn(result)
            })
        },[]
    )
    useEffect(()=>{
        if(loggedIn){
            window.location.href="/"
        }

    },[loggedIn])

    const login=()=>{
        makeAxiosPostRequest("/loginUser",{username:username,password:password},
            (err,response)=>{
            if(err)
                throw err
            console.log(response)
            setLoggedIn(response.result)
        })


    }
    return(
        <>
        <div id="login-form">
            <div className="label-input-box">
                <p className="label medium-text">Username</p>
                <input id="login-username" onChange={e=>setUsername(e.target.value)} type="text" className="medium-text"></input>
            </div>
            <div className="label-input-box">
                <p className="label medium-text">Password</p>
                <input id="login-password" onChange={e=>setPassword(e.target.value) }type="password" className="medium-text"></input>
            </div>

            <input type="submit" id="login-submit" onClick={login}></input>
                <p id="login-err" className="para-text"></p>
        </div>

        <p className="para-text">Not have an account?<a href="/register"> Register</a></p>
        </>
    )
}

export default Login;