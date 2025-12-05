import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new Schema({
    username:{
        type: String,
        required: [true,"Username is required"],
        unique: true,
        minlength: 3,
    },
    email:{
        type: String,
        required: [true,"Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true,"Password is required"],
        minlength: 8,
    },
    credits:{
        type: Number,
        default: 10,
        min: 0,
    },
})
const hashedPassword = bcrypt.hash(password,10)
this.password = hashedPassword
export const User = mongoose.model('User',userSchema)