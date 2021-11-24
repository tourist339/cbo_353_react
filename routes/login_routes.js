
const express=require("express")
const env=require("../env")
const Customer=require("../database/Customer")
const Login=require("../database/Login")
const Staff = require("../database/Staff");
const router=express.Router()



router.use((req,res,next)=>{
    next()
})
router.get("/login/getLoginDetails",(req,res)=>{
    const isLoggedIn=req.session.loggedIn
    // console.log(req.session)
    if(isLoggedIn) {
        res.send({loggedIn: true,username:req.session.username,type:req.session.type,id:req.session.loginId})
    }else{
        res.send({loggedIn: false})

    }
})

router.post("/loginUser",(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    Login.loginVerification(username,password,(result,data)=>{
        if(!result){
            res.send({"result":false})
        }else{
            req.session.loggedIn=true
            req.session.username=data.username
            req.session.loginId=data.id
            req.session.type=data.type
        console.log(req.session)

        res.send({result:true,data:req.session})


    }})


})

router.get("/register",(req,res)=>{
    if(!req.secure.hasOwnProperty("loggedIn")||!req.session.loggedIn){
        res.sendFile(env.root_dir+"/templates/register.html")

    }
})
router.get("/logout",(req,res)=>{
    req.session=null
    // req.session.loggedIn=false
    // req.session.username=""
    // req.session.type=""
    res.send({result:true})
})

router.post("/registerCustomer", (req, res) => {

    let allKeys=Object.keys(req.body);
    for (let i = 0; i < allKeys.length; i++) {
        if (req.body[allKeys[i]] == "") {
            res.send({result: false, data: "Empty " + allKeys[i]})
            break
        }
    }


        Customer.createNewCustomer(req.body.username, req.body.password,(result,data)=>{
            if(result){
                const loginId=data.insertId
                Customer.createCustomerData(loginId,req.body.first_name,req.body.last_name,req.body.addiction_kind,req.body.phone_num,(result,data)=>{
                    if(!result){
                        res.send({result:false,data:data})
                        return
                    }
                    req.session.loggedIn=true
                    req.session.username=data.username
                    req.session.type=data.type
                    req.session.loginId=data.id
                    res.send({result:true})


                })
            }else{
                res.send({result: false, data: data})

            }
        })



})

module.exports=router