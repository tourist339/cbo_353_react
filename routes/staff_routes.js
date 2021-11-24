
const express=require("express")
const env=require("../env")
const Customer=require("../database/Customer")
const Login=require("../database/Login")
const Staff=require("../database/Staff")
const Database=require("../database/Database")

const router=express.Router()

router.use((req,res,next)=>{
    if(env.checkLoggedIn(req)){
        if(!req.session.type=="staff"){
        res.send({result:false,data:"Not logged in as admin"})
        }else{
            next()
        }
    }else{
        res.send("Not logged in")
    }
})


router.get("/getInformation",(req,res)=>{


    Staff.getSingleStaffFromLoginId(req.session.loginId,(result,data)=>{

        res.send({result:result,data:data})

    })

})

module.exports=router