const express =require("express")
const bodyParser =require("body-parser");
const session=require("express-session")
const app=express()
const loginRoutes=require("./routes/login_routes")
const adminRoutes=require("./routes/admin_routes")
const databaseHandler=require("./DatabaseHandler")
const env = require("./env");
app.use(express.static("public/css"))
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static("public"))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
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
