const fillAddicitonsList=(element_id,callback)=>{
    fetch("/getAllAddictions",{
        method:"GET"
    }).then((response)=>response.json())
        .then(data=>{
            let addictionSelect=document.getElementById(element_id)

            data.forEach((addiction,index)=>{
                let option=document.createElement("option")
                option.setAttribute("value",addiction.id)
                option.innerHTML=addiction.name
                addictionSelect.appendChild(option)
                if(index==data.length-1){
                    if(callback)callback()
                }
            })
        })
        .catch(err=>console.log(err))
}

export {fillAddicitonsList}