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
    static getReportFromReportId(report_id,callback){
        let query=`SELECT data FROM ${env.database.REPORT_TABLE} WHERE id = ?`
        conn.query(query,[report_id],(err,result)=>{
            if(err){
                throw err
            }
            console.log(result,report_id)
            callback(result[0].data)
        })
    }

    static getReportsArrayFromReportIDs(report_ids_array,callback){
         let reports_array=[]
        for (let i = 0; i < report_ids_array.length; i++) {
            const report_id=report_ids_array[i]
            this.getReportFromReportId(report_id,(report)=>{
                reports_array.push(report)
                if(reports_array.length==report_ids_array.length){
                    callback(reports_array)
                }
            })
        }
    }
    static getReportsArrayFromCustomerId(customerId,callback){
        let query=`SELECT report_ids FROM ${env.database.CUSTOMER_TABLE} WHERE id = ?`
        conn.query(query,[customerId],(err,result)=>{
            if(err)
                throw err
            let report_ids=result[0].report_ids
            if(report_ids&&report_ids.length>0){
                callback(report_ids.split(","))
            }else{
                callback([])
            }
        })

    }
    static addReportId(customerId,reportId,callback){

         this.getReportsArrayFromCustomerId(customerId,(reports_array)=>{
             reports_array.push(reportId)
             let new_array_string=reports_array.join(",")
             let query=`UPDATE ${env.database.CUSTOMER_TABLE} SET report_ids = ? WHERE id = ?`
             conn.query(query,[new_array_string,customerId],(err,result)=> {
                 if(err)
                     throw err
                 callback(result)
             })
         })

    }

    static getSingleCustomer(id,callback){
        let query=`SELECT * FROM ${env.database.CUSTOMER_TABLE} WHERE id = ?`
        conn.query(query,[id],(err,result)=>{
            if(err){
                throw err
            }
            let customer=result[0]
            let customer_report_ids=customer.report_ids
            if(customer_report_ids&&customer_report_ids!=""){
                let customer_report_ids_array=customer_report_ids.split(",")
                this.getReportsArrayFromReportIDs(customer_report_ids_array,reports_array=>{
                    customer.reports=reports_array
                    callback(customer)

                })
            }else{
                customer.reports=[]
                callback(customer)
            }
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