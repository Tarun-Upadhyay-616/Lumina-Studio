import express from "express";
import { signin } from "../Controllers/AuthControllers.js";
import { AiGenerator } from "../Controllers/AiController.js";

const authroutes = express.Router()
// authroutes.post("/signup",signup)
authroutes.post("/signin",signin)
authroutes.get("/ai",AiGenerator)

export default authroutes