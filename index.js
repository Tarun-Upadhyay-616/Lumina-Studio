import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authroutes from "./Routes/AuthRoutes.js"
import cors from 'cors'
import cookieparser from "cookie-parser"
import imageroutes from "./Routes/ImageRoutes.js"
const app = express()
dotenv.config()
const port  = process.env.PORT || 3000
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    credentials: true
}))
app.use('/api/auth',authroutes)
app.use('/edit',imageroutes)
app.use(cookieparser())
app.use(express.json())
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