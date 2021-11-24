const app=require("./server")
const mysql=require("mysql")
const database=require("./DatabaseHandler")
const env=require("./env")
const conn=mysql.createConnection({
    user:"root",
    password:"nestle333",
    host:"localhost",
    database:"cbo_addiction"
})

conn.connect(async err => {
    if (err) throw err;
    await database.init(conn)
    console.log("MySQL Initialised")

})
const PORT=8080


app.listen(PORT,()=>{
    console.log("Listening on port "+PORT)
})

