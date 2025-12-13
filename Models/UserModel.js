const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
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
    
},{ 
    timestamps: true
})

const User = mongoose.model('User',userSchema)
module.exports = User