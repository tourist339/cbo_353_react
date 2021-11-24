import axios from "axios";
const SERVER_URL="http://localhost:8080"
const makeAxiosGetRequest=(url,callback)=>{

    axios(SERVER_URL+url,{
        method:"get",
        withCredentials: true
    })
        .then(response=>{
            callback(null,response.data)
        })
        .catch(err=>
            callback(err,err)
        )
}

const makeAxiosPostRequest=(url,data,callback)=>{

    axios.post(SERVER_URL+url,data,{
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })
        .then(response=>{
            callback(null,response.data)
        })
        .catch(err=>
            callback(err,err)
        )
}
const isUserLoggedIn=(callback)=>{
    makeAxiosGetRequest("/login/getLoginDetails",(err,response)=>{
        if(err)
            throw err
        if(response.loggedIn){
            callback(true,response)

        }else{
            callback(false,{})

        }
    })
}
const logoutUser=(callback)=>{
    makeAxiosGetRequest("/logout",(err,response)=>{
        if(err)
            throw err
        window.location.reload()
    })
}
export {makeAxiosGetRequest,makeAxiosPostRequest,isUserLoggedIn,logoutUser}