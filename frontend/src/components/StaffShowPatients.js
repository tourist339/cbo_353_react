import React, {useEffect} from 'react';
import {makeAxiosGetRequest} from "../helper";

const StaffShowPatients = (props) => {
    useEffect(()=>{
        makeAxiosGetRequest("/staff/getInformation",(err,response)=>{
            console.log(response)
        })
    })
    return(
        <>fsdfs</>
    )
}

export default StaffShowPatients;