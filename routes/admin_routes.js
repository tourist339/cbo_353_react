
const express=require("express")
const env=require("../env")
const Customer=require("../database/Customer")
const Login=require("../database/Login")
const Staff=require("../database/Staff")
const Database=require("../database/Database")

const router=express.Router()

// router.use((req,res,next)=>{
//     if(env.checkLoggedIn(req)){
//         if(!req.session.type=="admin"){
//             res.send("Not logged in as admin")
//         }else{
//             next()
//         }
//     }else{
//         res.send("Not logged in")
//     }
// })
router.get("/",(req,res)=>{
    res.sendFile(env.root_dir+"/templates/admin/index.html")
})

router.get("/staff",(req,res)=>{
    if(req.query.hasOwnProperty("id")){
        Staff.getSingleStaff(req.query.id,(result,data)=>{
            if(!result){
                res.send(data)
            }else{
                res.sendFile(env.root_dir + "/templates/admin/singlestaff.html")
            }
        })
    }else {
        res.sendFile(env.root_dir + "/templates/admin/staff.html")
    }
})

router.get("/customer",(req,res)=>{
    if(req.query.hasOwnProperty("id")){
        Staff.getSingleStaff(req.query.id,(result,data)=>{
            if(!result){
                res.send(data)
            }else{
                res.sendFile(env.root_dir + "/templates/admin/singlestaff.html")
            }
        })
    }else {
        res.sendFile(env.root_dir + "/templates/admin/customer.html")
    }
})

router.get("/getSingleStaff",(req,res)=>{


        Staff.getSingleStaff(req.query.id,(result,data)=>{


                res.send({result:result,data:data})


        })

})

router.get("/getSingleStaffFromUsername",(req,res)=>{

    if(req.query.hasOwnProperty("username")&&req.query.username!=""){

        const username=req.query.username
        Login.getIdFromUsername(username,(result,id)=>{
            if(!result){
                res.send({result:false,data:id})
                return
            }

            Staff.getSingleStaffFromLoginId(id,(result,staff)=>{
                res.send({result:result,data:staff})
            })
        })
    }else{
        res.send({result:false,data:"Enter valid username"})
    }



})

router.get("/getSingleCustomerFromUsername",(req,res)=>{
    const username=req.query.username
    Login.getIdFromUsername(username,(result,loginId)=> {
        console.log()
            if (result) {
                Customer.getSingleCustomerFromLoginId(loginId, (result,customer) => {
                    if(!result)
                        res.send({result: false, data: customer})

                    Database.getAddictionNameFromId(customer.addiction_type, (addiction_name) => {

                        customer.addiction_type = addiction_name

                        Staff.getSingleStaff(customer.staff_id, (result,staff) => {
                            if(!result){
                                customer.staff = []

                            }else {
                                customer.staff = staff
                            }
                            res.send({result: true, data: customer})
                        })
                    })
                })
            }
        else
        {
            res.send({result: false, data: loginId})

        }
    }
    )
})

router.get("/getAllCustomers",(req,res)=>{
    Customer.getAllCustomers((allcustomers)=>{
        if(!allcustomers){
            res.send(["Error "+allcustomers])
        }
        let updatedCustomers=0
        let updateCustomer=(singleCustomer,username,addiction_type,doctor)=>{
            singleCustomer.username = username
            singleCustomer.addiction_type = addiction_type
            singleCustomer.doctor=doctor
            delete singleCustomer["staff_id"]
            updatedCustomers++
            if(updatedCustomers==allcustomers.length){
                res.send(allcustomers)

            }
        }
        for (let i = 0; i < allcustomers.length; i++) {
            let singleCustomer=allcustomers[i]
            Database.getAddictionNameFromId(singleCustomer.addiction_type,(addiction_name)=> {
                Login.getUsernameFromId(singleCustomer.login_id, (result, username) => {

                    if (singleCustomer.staff_id) {
                        Staff.getSingleStaff(singleCustomer.staff_id, (result,staff) => {
                            if(result) {
                                updateCustomer(singleCustomer, username, addiction_name, staff)
                            }else{
                                updateCustomer(singleCustomer, username, addiction_name, null)
                            }

                        })
                    }else{
                        updateCustomer(singleCustomer,username,addiction_name,null)
                    }

                })
            })
        }



    })
})


router.get("/getAllStaff",(req,res)=>{

    Staff.getAllStaff((allstaff)=>{

        if(!allstaff){
            res.send(["Error "+allstaff])
        }
       res.send(allstaff)

    })
})

router.post("/registerStaff",(req,res)=>{
    let allKeys=Object.keys(req.body);
    for (let i = 0; i < allKeys.length; i++) {
        if (req.body[allKeys[i]] == "") {
            res.send({result: false, data: "Empty " + allKeys[i]})
            break
        }
    }

    Staff.createNewStaff(req.body.username,req.body.password,(result,data)=>{
        if(!result){
            res.send({result:false,data:data})
            return
        }
        const loginId=data.insertId
        Staff.createStaffData(loginId,req.body.first_name,req.body.last_name,req.body.speciality,(result,data)=>{
            if(!result){
                res.send({result:false,data:data})
                return
            }

            res.send({result:true,data:data})

        })


    })
})

router.post("/addDoctorToPatient",(req,res)=>{
    if(req.body.hasOwnProperty("doctorId")&&req.body.hasOwnProperty("patientId")&&req.body.patientId!=""&&req.body.doctorId!=""){
        const patientId=req.body.patientId
        const doctorId=req.body.doctorId
        Customer.addDoctorToCustomer(patientId,doctorId,()=>{
            Staff.addCustomerToDoctor(patientId,doctorId,()=>{
                res.send({result:true,data:"Added"})
            })
        })

    }else{
        res.send({result:true,data:"PatientId or DoctorId not valid"})

    }
})

router.post("/deleteStaff",(req,res)=>{
    const staffId=req.body.staffId
    Staff.deleteStaff(staffId,()=>{
        res.send({result:true,data:"Staff Deleted"})
    })
})

router.post("/deleteCustomer",(req,res)=>{
    const customerId=req.body.customerId
    Customer.deleteCustomer(customerId,()=>{
        res.send({result:true,data:"Customer Deleted"})

    })
})

router.post("/removePatientFromDoctor",(req,res)=>{
    const patientId=req.body.patientId
    const doctorId=req.body.doctorId

    Database.removePatientFromDoctor(patientId,doctorId,()=>{
        Customer.removeDoctor(patientId,()=>{
            res.send({result:true,data:"Removed Patient"})
        })

    })
})

module.exports=router