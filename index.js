// const express = require("express")
// const dotenv = require("dotenv")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const authroutes = require("./Routes/AuthRoutes.js")
// const imageroutes = require("./Routes/ImageRoutes.js")
// const cookieparser = require("cookie-parser")

import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieparser from "cookie-parser"
import cors from "cors"
import authroutes from "./Routes/AuthRoutes.js"
import imageroutes from "./Routes/ImageRoutes.js"
import path  from 'path';


const app = express()
dotenv.config()
const port  = process.env.PORT || 3000
app.use(cookieparser())
app.use(express.json())

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    credentials: true
}))
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api/auth',authroutes)
app.use('/edit',imageroutes)

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
    console.log(`listening on port ${port}`)
})