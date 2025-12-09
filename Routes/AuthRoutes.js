import express from "express";
import { signin } from "../Controllers/AuthControllers.js";
const authroutes = express.Router()
// authroutes.post("/signup",signup)
authroutes.post("/signin",signin)

export default authroutes