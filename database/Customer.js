let conn
const bcrypt=require("bcrypt")
const env=require("../env")
const Database=require("./Database")
const Login = require("../database/Login")
class Customer{


     static init(database){
         conn=database
     }

     static createNewCustomer(username,password,callback){
         Database.createNewUser(username,password,"customer",callback)
     }

    static createCustomerData(login_id,firstname,lastname,addiction_type,phone_num,callback){
        let query=`INSERT INTO ${env.database.CUSTOMER_TABLE} (firstname,lastname,login_id,addiction_type,phone_num) VALUES(?,?,?,?,?)`
        conn.query(query,[firstname,lastname,login_id,addiction_type,phone_num],(err,result)=>{
            if (err){
                callback(false,err.message)
                return
            }
            callback(true,result)
        })
    }

    static getSingleCustomer(id,callback){
        let query=`SELECT * FROM ${env.database.CUSTOMER_TABLE} WHERE id = ?`
        conn.query(query,[id],(err,result)=>{
            if(err){
                throw err
            }
            callback(result[0])
        })
    }



    static getAllCustomers(callback){
        let query=`SELECT * FROM ${env.database.CUSTOMER_TABLE}`
        conn.query(query,(err,result)=>{
            if(err){
                throw err
            }
            callback(result)
        })
    }
     static updateCustomerData(){

     }

     static addDoctorToCustomer(patientId,doctorId,callback){
         let query=`UPDATE ${env.database.CUSTOMER_TABLE} SET staff_id = ? WHERE id = ?`
         conn.query(query,[doctorId,patientId],(err,result)=>{
             if(err){
                 throw err
             }
             callback(result)
         })
     }

     static removeDoctor(patientId,callback){
         let query=`UPDATE ${env.database.CUSTOMER_TABLE} SET staff_id = NULL WHERE id = ?`
         conn.query(query,[patientId],(err,result)=>{
             if(err){
                 throw err
             }
             callback(result)
         })
     }
    static deleteCustomer(id,callback){
         this.getSingleCustomer(id,customer=>{
             Database.removePatientFromDoctor(id,customer.staff_id,()=>{
                 Login.deleteUser(customer.login_id,()=>{
                     let query=`DELETE FROM ${env.database.CUSTOMER_TABLE} WHERE id = ?`
                     conn.query(query,[id],(err,result)=>{
                         if(err){
                             throw err
                         }
                         callback(result)

                     })
                 })
             })
         })

    }

    static getSingleCustomerFromLoginId(login_id,callback){
        let query=`SELECT * FROM ${env.database.CUSTOMER_TABLE} WHERE login_id = ?`
        conn.query(query,[login_id],(err,result)=>{
            if(err||result.length==0){
                callback(false,"No customer exists in database with id "+staff_id)
                return
            }
            callback(true,result[0])


        })
    }


}
module.exports=Customer