let conn
const bcrypt=require("bcrypt")
const env=require("../env")
class Login{


    static init(database){
        conn=database
    }

    static loginVerification(username,password,callback){
        let query=`SELECT * FROM ${env.database.LOGIN_TABLE} WHERE username = ?`
        conn.query(query,username,(err,result)=>{
            console.log("Login Result: "+result)
            if(result!=undefined&&result.length>0) {
                bcrypt.compare(password, result[0].password, (err, res) => {
                    if (res) {
                        callback(true, result[0])
                    } else {
                        callback(false)
                    }
                })
            }else {
                callback(false)
            }
        })

    }

    static getUsernameFromId(login_id,callback){
        let query=`SELECT username FROM ${env.database.LOGIN_TABLE} WHERE id = ?`
        conn.query(query,[login_id],(err,result)=>{
            if(err||result.length==0){
                callback(false,"No such Login Id")
                return
            }

            callback(true,result[0].username)



        })
    }

    static getIdFromUsername(username,callback){
        let query=`SELECT id FROM ${env.database.LOGIN_TABLE} WHERE username = ?`
        conn.query(query,[username],(err,result)=>{
            if(err||result.length==0){
                callback(false,"No such username found in database")
                return
            }

            callback(true,result[0].id)



        })
    }

    static deleteUser(id,callback){
        let query=`DELETE FROM ${env.database.LOGIN_TABLE} WHERE id = ?`
        conn.query(query,[id],(err,result)=>{
            if(err){
                throw err
            }
            callback(result)


        })
    }


}
module.exports=Login