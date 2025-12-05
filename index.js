import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
const app = express()
dotenv.config()
const port  = process.env.PORT || 3000
app.get('/',(req,res)=>{
    res.send("Working")
})
const dburl = process.env.DBURL
mongoose.connect(dburl)
    .then(console.log("mongodb connected"))
    .catch((err)=>{
        console.log(err.message);
    })
app.listen(port,()=>{
    console.log('listening on port 8080')
})