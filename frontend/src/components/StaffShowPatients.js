import React, {useEffect, useState} from 'react';
import {makeAxiosGetRequest, makeAxiosPostRequest} from "../helper";
import "../css/staff/staff.css"
const StaffShowPatients = (props) => {
    const [staff,setStaff]=useState({})
    const [report,setReport]=useState("")
    const [customerSelected,setCustomerSelected]=useState({})
    const [activePatientUsername,setActivePatientUsername]=useState("")
    const [updated,setUpdated]=useState("")
    useEffect(()=>{
        makeAxiosGetRequest("/staff/getInformation",(err,response)=>{
            setStaff(response.data)
            if(customerSelected.hasOwnProperty("id")){
                let newCustomerSelected=response.data.customers.filter(customer=>customer.id==customerSelected.id)[0]
                console.log(newCustomerSelected)
                setCustomerSelected(newCustomerSelected)
            }
        })
    },[updated])

    function addReport() {
        makeAxiosPostRequest("/staff/addReport",{
            customerId:customerSelected.id,
            reportData:report
        },(err,response)=>{
            setUpdated(updated+"a")
        })
    }

    return(
        <div id="main-staff" className="row-flex">
            <div id="all-customers">
                <p className={"medium-text"}>All Patients</p>
            {staff.hasOwnProperty("customers")?
                staff.customers.map(customer=>
                    <button key={customer.id} onClick={()=>setCustomerSelected(customer)} className={"classic-btn bg-gray"}>{customer.firstname+" "+customer.lastname}</button>
                )
                :<></>}
            </div>
            <div id="single-customer-reports" className={"col-flex"}>
                {customerSelected.hasOwnProperty("reports") ?
                    <React.Fragment>
                        <div id="sc-allreports">
                            {customerSelected.reports.length > 0 ?
                                    customerSelected.reports.map((report,index) => {
                                        return <div key={index} className={"single-report-box medium-text"}>{report}</div>
                                        }
                                    )

                                :
                                <p className={"large-text"}> No report yet</p>
                            }


                        </div>
                        <div className={"row-flex"}>
                            <input type={"text"} style={{width: "100%"}} placeholder={"Enter report here"}
                                   className={"medium-text"} value={report} onChange={e => setReport(e.target.value)}/>
                            <button className={"classic-btn medium-text"} onClick={()=>addReport()}>Add</button>
                        </div>
                    </React.Fragment>
                    : <></>
                }
            </div>
        </div>
    )
}

export default StaffShowPatients;