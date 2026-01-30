const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
	username:{type:String,unique:true},
	hash:String,
	phone:String,
	verifiedphone:{type:Boolean,default:false},
	verificationcode:Number
})

module.exports = mongoose.model("User",userSchema)
