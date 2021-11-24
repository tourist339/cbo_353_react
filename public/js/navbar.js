

window.addEventListener("load",()=>{
    const navbar=document.getElementById("navigation-bar")
    fetch("/login/getLoginDetails").then(response=>response.json())
        .then(data=>{
            if(data.hasOwnProperty("loggedIn")){
                if (data.loggedIn){
                    // navbar.innerHTML="Logged In"
                }
            }
        })
})