import {fillAddicitonsList} from "../base.js";

const getAllStaff=()=>{
    fetch("/admin/getAllStaff",{
        method:"GET"
    }).then((response)=>response.json())
        .then(data=>{
            let staffTable=document.getElementById("all-staff-table")
            staffTable.innerHTML=`
               <tr>
               <th>Username</th>
                <th>Name</th>
                <th>Speciality</th>
                <th>Link</th>

            </tr>
            `
            console.log(data)
            data.forEach(staff=>{
                let singleRow=document.createElement("tr")
                singleRow.innerHTML=`
                <td>${staff.username}</td>

<td>${staff.firstname+" "+staff.lastname}</td>
                <td>${staff.addiction_speciality}</td>
                <td><a class="classic-btn" href="/admin/staff?id=${staff.id}">View</a></td>`
                staffTable.appendChild(singleRow)
            })
        })
        .catch(err=>console.error(err))
}
window.addEventListener("load",()=>{
    let registerErrField=document.getElementById("staff-add-err")
    getAllStaff()

   fillAddicitonsList("addiction-speciality")


    document.getElementById("submit-add-staff").addEventListener("click",()=>{
        let password=document.getElementById("staff-password")
        let confirmPassword=document.getElementById("staff-confirm-password")
        let registerStaffForm=document.getElementById("register-staff-form")

        if(password.value!=confirmPassword.value){
            registerErrField.innerText="Passwords do not match"
            return
        }
        let formData=new FormData(registerStaffForm)
        let dataToSubmit={}
        for (const key of formData.keys()){
            dataToSubmit[key]=formData.get(key)
        }
        fetch("/admin/registerStaff",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json' ,//this must be set to a json type
            },
            body:JSON.stringify(dataToSubmit)
        }).then((response)=>response.json())
            .then(data=>{
                if(data.result==false){
                    registerErrField.innerText=data.data
                }else {
                    getAllStaff()
                }
            })
            .catch(err=>console.error(err))


    })
})