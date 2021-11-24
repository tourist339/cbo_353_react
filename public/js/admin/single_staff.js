import {fillAddicitonsList} from "../base.js";

let staff_data={}
window.addEventListener("load",async () => {
    let staffFirstName=document.getElementById("first-name")
    let staffLastName=document.getElementById("last-name")

    fetch("/admin/getSingleStaff?id=" + new URLSearchParams(window.location.search).get("id"), {
        method: "GET"
    })
        .then((response) => response.json())
        .then(data => {
            if(data.result) {
                let staffData=data.data;
                staff_data=staffData
                console.log(staffData)

                staffFirstName.value=staffData.firstname
                staffLastName.value=staffData.lastname
                const allCustomers=staffData.customers

                fillAddicitonsList("addiction-speciality", () => {
                    let options = document.getElementById("addiction-speciality").children
                    for (let i = 0; i < options.length; i++) {
                        if(options[i].value==staffData.addiction_speciality){
                            options[i].setAttribute("selected",true)
                        }
                    }
                })

                const patientsTable=document.getElementById("all-patients-table")
                patientsTable.innerHTML=`
                <tr>

                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone Number</th>
                                        <th>Addiction Type</th>

                    <th>Links</th>
                </tr>
                `
                for (let i = 0; i < allCustomers.length; i++) {
                    let singleCustomerRow=document.createElement("tr")
                    let currentCustomer=allCustomers[i]
                    singleCustomerRow.innerHTML=
                        `
                        <td>${currentCustomer.firstname}</td>
                         <td>${currentCustomer.lastname}</td>
                         <td>${currentCustomer.phone_num}</td>

                         <td><button class="remove-patient-from-doctor classic-btn" customerid="${currentCustomer.id}">Remove</button> </td>

                        `
                    patientsTable.appendChild(singleCustomerRow)
                }

                let removePatientButtons=document.getElementsByClassName("remove-patient-from-doctor")

                for (let i = 0; i < removePatientButtons.length; i++) {
                    removePatientButtons[i].addEventListener("click",e=>{
                        const customerId=e.target.getAttribute("customerid")
                        console.log(customerId)
                        const doctorId=staffData.id
                        fetch("/admin/removePatientFromDoctor",{
                            method:"POST",
                            headers: {
                                'Content-Type': 'application/json' ,//this must be set to a json type
                            },
                            body:JSON.stringify({patientId:customerId,doctorId:doctorId})
                        }).then((response)=>response.json())
                            .then(data=>{
                                console.log(data)
                                if(data.result){
                                    //window.location.reload(true)
                                }else{
                                   // alert(data.data)
                                }
                            })
                            .catch(err=>console.error(err))

                    })
                }
            }
        })
        .catch(err => console.error(err))

    document.getElementById("review-patient-btn").addEventListener("click",()=>{
        let usernameToReview=document.getElementById("review-patient-username").value
        let searchedPatientBox=document.getElementById("searched-patient-box")
        fetch("/admin/getSingleCustomerFromUsername?username="+usernameToReview,{
            method:"GET"
        })
            .then((response) => response.json())
            .then(data => {
                console.log(data)

                function addDoctorToPatient(btn){
                    let doctorId=btn.getAttribute("doctorid")
                    let patientId=btn.getAttribute("patientid")
                    let dataToSubmit={patientId:patientId,doctorId:doctorId}
                    fetch("/admin/addDoctorToPatient",{
                        method:"POST",
                        headers: {
                            'Content-Type': 'application/json' ,//this must be set to a json type
                        },
                        body:JSON.stringify(dataToSubmit)
                    }).then((response)=>response.json())
                        .then(data=>{
                            if(data.result){
                                window.location.reload(true)
                            }else{
                                alert(data.data)
                            }
                        })
                        .catch(err=>console.error(err))

                }

                if(!data.result){
                    searchedPatientBox.innerHTML=`<p class="para-text">${data.data}</p>`
                }else{
                    let patient=data.data
                    let updateBtn=document.createElement("button")
                    updateBtn.classList.add("classic-btn")
                    updateBtn.innerHTML="Update"
                    updateBtn.setAttribute("doctorid",staff_data.id)
                    updateBtn.setAttribute("patientid",patient.id)

                    updateBtn.addEventListener("click",()=>
                    {addDoctorToPatient(updateBtn)})

                    searchedPatientBox.innerHTML=
                        `
                        <table>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone Number</th>
                                                                <th>Addiction Type</th>

                            </tr>
                            <tr>
                                <td>${patient.firstname}</td>
                                <td>${patient.lastname}</td>
                                <td>${patient.phone_num}</td>
                                <td>${patient.addiction_type}</td>
                                
                            </tr>
                                               
                                                

</tr>
                                                <tr></tr>

</table>`
                        searchedPatientBox.appendChild(updateBtn)
                }
            })
            .catch(err => console.error(err))
    })



})