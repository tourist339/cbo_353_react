

window.addEventListener("load",()=>{

    document.getElementById("login-submit").addEventListener("click",()=>{
        fetch("/loginUser",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json' ,//this must be set to a json type
            },
            body:JSON.stringify({username:document.getElementById("login-username").value,password:document.getElementById("login-password").value})
        }).then(response=>response.json())
            .then(data=>{
                if(data.result==true){
                    window.location.href="/"
                }else{
                    document.getElementById("login-err").innerText="Wrong Username/Password"
                }

            })
            .catch(err=>console.error(err))
    })




})