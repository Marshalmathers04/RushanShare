const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	location:String,
	caption:String,
	imagePathname:String,
	addedtime:{type:Date,default:Date.now},
	coordinates:[Number],
	likesCount:Number,
	userId:String
})

module.exports = mongoose.model('Post',postSchema)
