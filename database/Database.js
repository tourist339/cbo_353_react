let conn
const bcrypt=require("bcrypt")
const env=require("../env")
class Database{


    static init(database){
        conn=database
    }

    static createNewUser(username,password,user_type,callback){
        bcrypt.hash(password,1,(err,hash)=>{
            let query=`INSERT INTO ${env.database.LOGIN_TABLE} (username,password,type) VALUES(?,?,?)`
            conn.query(query,[username,hash,user_type],(err,result)=>{
                if (err){
                    callback(false,err.message)
                    return
                }
                callback(true,result)
            })
        })
    }

    static updateCustomerData(){

    }

    static getAddictionNameFromId(addiction_id,callback){
        let query=`SELECT name FROM ${env.database.ADDICTION_TABLE} WHERE id = ?`
        conn.query(query,[addiction_id],(err,result)=>{
            if(err||result.length==0){
                throw new Error("No such addiction id")
            }
            callback(result[0].name)

        })
    }

    static addDoctorToPatient(patientId,doctorId,callback){

    }
    static getCurrentPatientsIds(doctorId,callback){
        let query=`SELECT customer_ids FROM ${env.database.STAFF_TABLE} WHERE id = ?`
        conn.query(query,[doctorId],(err,result)=>{
            if(err||result.length==0){
                throw new Error("No Doctor with such id")
            }
            let customer_ids=result[0].customer_ids
            callback(customer_ids)


        })
    }

    static removePatientFromDoctor(patientId,doctorId,callback){
        console.log("here")
        patientId=patientId.toString()
        this.getCurrentPatientsIds(doctorId,customerIds=>{
            console.log(customerIds)
            if(customerIds==null||customerIds==""){
                callback()
            }else{
                let customerIdsArray=customerIds.split(",")
                const index = customerIdsArray.indexOf(patientId);
                console.log(customerIdsArray,index,patientId)

                if (index > -1) {
                    customerIdsArray.splice(index, 1);
                }
                console.log(customerIdsArray)
                let updatedCustomerIds=customerIdsArray.length==0?"":customerIdsArray.join(",")
                let query=`UPDATE ${env.database.STAFF_TABLE} SET customer_ids = ? WHERE id = ?`
                conn.query(query,[updatedCustomerIds,doctorId],(err,result)=>{
                    if(err){
                        throw err
                    }
                    callback(result)
                })
            }

        })
    }



}
module.exports=Database