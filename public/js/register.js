import {fillAddicitonsList} from "./base.js";

window.addEventListener("load",()=> {

    fillAddicitonsList("addiction-kind")
    let registerForm = document.getElementById("register-customer-form")
    let errField = document.getElementById("err-register-field")
    document.getElementById("register-submit").addEventListener("click", () => {

        let formData = new FormData(registerForm)
        let phone_num = formData.get("phone_num")
        let password=document.getElementById("password")
        let confirmPassword=document.getElementById("confirm-password")

        if(password.value!=confirmPassword.value){
            errField.innerText = "Passwords do not match"
            return
        }


        if (phone_num.length != 10) {
            errField.innerText = "Phone number length must be 10"
            return
        }
        for (let i = 0; i < 10; i++) {
            if (!(phone_num[i] >= '0' && phone_num[i] <= '9')) {
                errField.innerText = "Phone number can only contain numbers"
                return
            }
        }

        let toSubmitData = {}
        for (const key of formData.keys()) {
            toSubmitData[key] = formData.get(key)
        }
        fetch("/registerCustomer", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',//this must be set to a json type
            },
            body: JSON.stringify(toSubmitData)})
                .then(response => response.json())
                .then(data =>{
                    console.log(data)
                    if(data.result){
                        window.location.href="/"
                    }else{
                        errField.innerText=data.data
                    }
                })
                .catch(err => console.error(err))
        })
    })