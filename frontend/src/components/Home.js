import React, {useEffect} from 'react';
import {isUserLoggedIn} from "../helper";

const Home = (props) => {
    useEffect(()=>{

        if(props) {


            isUserLoggedIn((isLoggedIn, details) => {
                if (isLoggedIn) {
                    console.log(props)
                    props.history.push("/" + details.type)
                }
            })
        }
    },[props]);

return(
        <h1>Home</h1>
    )
}


export default Home;