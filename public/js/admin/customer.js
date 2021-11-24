import {fillAddicitonsList} from "../base.js";

let allCustomersList={}

const fillCustomersTable=(data)=>{
    let customersTable=document.getElementById("all-customers-table")
    customersTable.innerHTML=`
      <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
                        <th>Phone Number</th>

            <th>Addiction Kind</th>
             <th>Doctor</th>

            <th>Links</th>
        </tr>
    `

    data.forEach((customer,index)=>{

        let singleRow=document.createElement("tr")
        let doctorTd=``
        if(customer.doctor){
            doctorTd=`<td><div class="row-flex-center"> <p>${customer.doctor.firstname+" "+customer.doctor.lastname}</p><a class="classic-btn para-text" target="_blank" href="/admin/staff?id=${customer.doctor.id}">View</a></div> </td>`

        }else{

            doctorTd=`<td><div class="row-flex-center"> <p>Not yet assigned</p><button class="classic-btn para-text assign-doctor-btn" customerIndex=${index}>Assign</button></div> </td>`

        }
        singleRow.innerHTML=`
                <td>${customer.username}</td>

                <td>${customer.firstname}</td>

                <td>${customer.lastname}</td>
                                <td>${customer.phone_num}</td>

                <td>${customer.addiction_type}</td>
                ${doctorTd}

                <td>
                <button class="classic-btn delete-customer-btn" customerid="${customer.id}">Delete</button></td>
`
        customersTable.appendChild(singleRow)
        if(!customer.doctor) {
            let assignDoctorRow=document.createElement("tr")
            assignDoctorRow.innerHTML=`
    <td id="assign-doctor-box-${index}" class="hidden" colspan="6">
            <div  id="assign-doctor-box-${index}" class="assign-doctor-box">
                 <div class="row-flex label-input-box" >
            <p class="label medium-text">Doctor Username: </p>
            <input type="text" class="medium-text search-doctor-input" id="search-doctor-input-${index}" placeholder="Enter username here">
        </div>
        <input  type="button" customerindex="${index}" value="Search" id="search-doctor-btn-${index}" class="classic-btn search-doctor-btn">
        <div class="searched-doctor-box" id="searched-doctor-box-${index}">
       
        </div>
            </div>
</td>`
            customersTable.appendChild(assignDoctorRow)
        }


    })
    let assignBtns=document.getElementsByClassName("assign-doctor-btn")
    console.log(assignBtns.length)
    for (let i = 0; i < assignBtns.length; i++) {
        assignBtns[i].addEventListener("click",e=>{
            let customerIndex=e.target.getAttribute("customerindex")
            let assignDoctorBox=document.getElementById(`assign-doctor-box-${customerIndex}`)
            if(assignDoctorBox.classList.contains("hidden")){
                assignDoctorBox.classList.remove("hidden")

            }else{
                assignDoctorBox.classList.add("hidden")

            }
        })
    }

    let searchDoctorBtns=document.getElementsByClassName("search-doctor-btn")
    for (let i = 0; i < searchDoctorBtns.length; i++) {
        searchDoctorBtns[i].addEventListener("click",(e)=>{
            let customerIndex=e.target.getAttribute("customerindex")
            let doctorSearchInput=document.getElementById(`search-doctor-input-${customerIndex}`)
            let searchDoctorBox=document.getElementById(`searched-doctor-box-${customerIndex}`)

            let doctorUsername=doctorSearchInput.value
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
            fetch("/admin/getSingleStaffFromUsername?username="+doctorUsername,{
                method:"GET"
            }).then((response)=>response.json())
                .then(data=> {
                    console.log(data)
                    if(!data.result){
                        searchDoctorBox.innerHTML=`<p class="medium-text">${data.data}</p>`
                    }else {

                    let doctor=data.data
                        let updateBtn=document.createElement("button")
                        updateBtn.classList.add("classic-btn")
                        updateBtn.innerHTML="Update"
                        updateBtn.setAttribute("doctorid",doctor.id)
                        updateBtn.setAttribute("patientid",allCustomersList[customerIndex].id)

                        updateBtn.addEventListener("click",()=>
                        {addDoctorToPatient(updateBtn)})

                        searchDoctorBox.innerHTML = `
                    <table>
                    <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Speciality</th>
                    <th>Number of Patients</th>
                    </tr>
                    <tr>
                    <td>${doctor.firstname}</td>
                     <td>${doctor.lastname}</td>
                    <td>${doctor.addiction_type}</td>
                    <td>${doctor.customers.length}</td>
                    </tr>
                    </table>`

                        searchDoctorBox.appendChild(updateBtn)
                    }




                    }
                 )
                .catch(err=>console.error(err))
        })
    }


    let customerDeleteButtons=document.getElementsByClassName("delete-customer-btn")
    for (let i = 0; i < customerDeleteButtons.length; i++) {
        customerDeleteButtons[i].addEventListener("click",e=>{
            console.log("Fdsfs")
            const customerId=e.target.getAttribute("customerid")
            fetch("/admin/deleteCustomer",{ method:"POST",
                headers: {
                    'Content-Type': 'application/json' ,//this must be set to a json type
                },
                body:JSON.stringify({customerId:customerId})
            }).then((response)=>response.json())
                .then(data=>{
                    console.log(data)
                    // if(data.result){
                    //     window.location.reload(true)
                    // }else{
                    //     alert(data.data)
                    // }
                })
                .catch(err=>console.error(err))


        })
    }


}
const getAllCustomers=()=>{
    fetch("/admin/getAllCustomers",{
        method:"GET"
    }).then((response)=>response.json())
        .then(data=>{

            console.log(data)
            allCustomersList=data
            fillCustomersTable(data)

        })
        .catch(err=>console.error(err))
}
window.addEventListener("load",()=>{
    getAllCustomers()
    document.getElementById("input-search-text").addEventListener("input",e=>{
        console.log("Fds")
        let filterUsername=e.target.value
        let filteredCustomerList=[]

        for (let i = 0; i < allCustomersList.length; i++) {
            let customer=allCustomersList[i]
            if(customer.username.includes(filterUsername)){
                filteredCustomerList.push(customer)
            }
        }
        fillCustomersTable(filteredCustomerList)



    })


})