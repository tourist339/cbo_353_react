const express =require("express")
const bodyParser =require("body-parser");
const session=require("cookie-session")
const app=express()
const loginRoutes=require("./routes/login_routes")
const adminRoutes=require("./routes/admin_routes")
const databaseHandler=require("./DatabaseHandler")
const env = require("./env");
const cors=require("cors")
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(session({
    name: 'session',
    keys:["key1","key2"]
}))


app.use("/admin",adminRoutes)
app.use(loginRoutes)

app.get("/",(req,res)=>{
    console.log("here")
    if(env.checkLoggedIn(req)) {
        console.log("here")
        if(env.isAdmin(req)){
            res.redirect("/admin")
        }else {
            res.sendFile(env.root_dir + "/templates/customer/general_info.html")
        }
    }else{
        res.sendFile(env.root_dir + "/templates/index.html")

    }
})


app.get("/getAllAddictions",(req,res)=>{
    databaseHandler.getAllAddictions((result,data)=>{
        if(result){
            res.send(data)
        }
    })
})

module.exports= app
