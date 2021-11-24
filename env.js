
global={
    database: class Database{
        static DATABASE_NAME="cbo_addiction"
        static CUSTOMER_TABLE="customer"
        static STAFF_TABLE="staff"
        static REPORT_TABLE="report"
        static ADDICTION_TABLE="addictions"
        static LOGIN_TABLE="login_credentials"

    },
    root_dir:__dirname,
    checkLoggedIn:(req)=>{
        if (req.session.hasOwnProperty("loggedIn")&&req.session.loggedIn){
            return true
        }else{
            return false
        }
    },
    isAdmin:(req)=>{
        if(global.checkLoggedIn(req)){
            if(req.session.type=="admin"){
                return true
            }
        }
        return false
    }

}

module.exports=global