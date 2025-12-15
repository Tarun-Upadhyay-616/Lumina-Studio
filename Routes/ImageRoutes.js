import express from "express";
import multer from 'multer'
import { resizeImage } from "../Controllers/ImageController.js";

const imageroutes = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
imageroutes.post("/resize-image",upload.single('image'),resizeImage)

export default imageroutes