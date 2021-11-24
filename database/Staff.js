let conn
const bcrypt=require("bcrypt")
const env=require("../env")
const Database = require("./Database");
const Customer = require("../database/Customer");
const Login = require("../database/Login");
class Staff{

    constructor() {
    }
    static init(database){
        conn=database
    }

    static createNewStaff(username,password,callback){
        Database.createNewUser(username,password,"staff",callback)
    }


    static createStaffData(login_id,firstname,lastname,speciality,callback){
        let query=`INSERT INTO ${env.database.STAFF_TABLE} (firstname,lastname,login_id,addiction_speciality) VALUES(?,?,?,?)`
        conn.query(query,[firstname,lastname,login_id,speciality],(err,result)=>{
            if (err){
                callback(false,err.message)
                return
            }
            callback(true,result)
        })
    }




    static getAllStaff(callback){


        let query=`SELECT * FROM ${env.database.STAFF_TABLE}`
        conn.query(query,(err,result)=> {
            if (err) {
                throw err
            }
            let allstaff = result
            let updatedStaff = 0

            let updateStaff = (singleStaff, username, addiction_type, customers) => {
                singleStaff.username = username
                singleStaff.addiction_type = addiction_type
                singleStaff.customers = customers
                delete singleStaff["customer_ids"]
                updatedStaff++
                if (updatedStaff == allstaff.length) {
                    callback(allstaff)
                }
            }
            allstaff.forEach((singlestaff, index) => {
                Database.getAddictionNameFromId(singlestaff.addiction_speciality, (addiction_name) => {
                    Login.getUsernameFromId(singlestaff.login_id, (result, username) => {
                        let customers=singlestaff.customer_ids

                        console.log(singlestaff)
                        if(customers&&customers!=""){
                            this.getCustomersObjects(customers,customersToAdd=>{
                                updateStaff(singlestaff, username, addiction_name, customersToAdd)

                            })

                        }else {
                            updateStaff(singlestaff, username, addiction_name, [])
                        }
                    })
                });
            })
        })

    }

    static getCustomersObjects(customers,callback){
        let customer_ids_array=customers.split(",")
        let customersToAdd=[]
        let updatedCustomers=0
        for (let i = 0; i <customer_ids_array.length; i++) {
            Customer.getSingleCustomer(customer_ids_array[i],(customer)=>{
                customersToAdd.push(customer)
                updatedCustomers++
                if(updatedCustomers==customer_ids_array.length){
                    callback(customersToAdd)

                }
            })
        }
    }

    static updateSingleStaff(singlestaff,callback){
        let updateStaff = (singleStaff, username, addiction_type, customers) => {
            singleStaff.username = username
            singleStaff.addiction_type = addiction_type
            singleStaff.customers = customers
            delete singleStaff["customer_ids"]
            callback(true,singlestaff)

        }
        Database.getAddictionNameFromId(singlestaff.addiction_speciality, (addiction_name) => {
            Login.getUsernameFromId(singlestaff.login_id, (result, username) => {
                let customers=singlestaff.customer_ids
                if(customers&&customers!=""){
                    this.getCustomersObjects(customers,customersToAdd=>{
                        updateStaff(singlestaff, username, addiction_name, customersToAdd)

                    })
                }else {
                    updateStaff(singlestaff, username, addiction_name, [])
                }
            })
        });
    }

    static getSingleStaff(staff_id,callback){
        let query=`SELECT * FROM ${env.database.STAFF_TABLE} WHERE id = ?`
        conn.query(query,[staff_id],(err,result)=>{
            if(err||result.length==0){
                callback(false,"No staff exists in database with id "+staff_id)
                return
            }
            let singlestaff=result[0]
            this.updateSingleStaff(singlestaff,callback)


        })
    }

    static getSingleStaffFromLoginId(login_id,callback){
        let query=`SELECT * FROM ${env.database.STAFF_TABLE} WHERE login_id = ?`
        conn.query(query,[login_id],(err,result)=>{
            if(err||result.length==0){
                callback(false,"No staff exists in database with id "+login_id)
                return
            }
            let singlestaff=result[0]
            this.updateSingleStaff(singlestaff,callback)


        })
    }



    static addCustomerToDoctor(patientId,doctorId,callback){

        Database.getCurrentPatientsIds(doctorId,customerIds=>{
            let updateCustomerIds=""
            if(customerIds==null||customerIds==""){
                updateCustomerIds=patientId
            }else{
                updateCustomerIds=customerIds+","+patientId

            }
            let query=`UPDATE ${env.database.STAFF_TABLE} SET customer_ids = ? WHERE id = ?`
            conn.query(query,[updateCustomerIds,doctorId],(err,result)=>{
                if(err){
                    throw err
                }
                callback(result)
            })
        })

    }


    static deleteStaff(id){
        this.getSingleStaff(id,staff=>{
            let updatedCustomers=0
            staff.customers.forEach(customer=>{
                Customer.removeDoctor(customer.id,()=>{
                    updatedCustomers++
                    if(updatedCustomers==staff.customers.length){
                        Login.deleteUser(staff.login_id,()=>{
                            let query=`DELETE FROM ${env.database.STAFF_TABLE} WHERE id = ?`
                            conn.query(query,[id],(err,result)=>{
                                if(err){
                                    throw err
                                }
                                callback(result)
                            })
                        })
                    }
                })
            })
        })

    }




}
module.exports=Staff