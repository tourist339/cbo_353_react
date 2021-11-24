import React, {useEffect, useState} from 'react';
import {makeAxiosGetRequest} from "../helper";

const AddictionSelectBox = ({onChange}) => {
    const [options,setOptions]=useState([])
    useEffect(()=>{
        makeAxiosGetRequest("/getAllAddictions",(err,response)=>{
            console.log(response)
            setOptions(response)
            onChange(response[0].value)
        })}
        ,[]
    )
    return (
        <select onChange={e=>onChange(e.target.value)}>
            {options.map(option=>{
                return <option key={option.id} value={option.id}>{option.name}</option>
            })}
        </select>
    )
}

export default AddictionSelectBox;