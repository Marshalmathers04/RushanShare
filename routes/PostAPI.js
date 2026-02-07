const express = require("express")
const Post = require("../models/Post.js")
const User = require("../models/User.js")
const router = express.Router()


router.get("/api/feed", async (req,res)=>{
	try{
		if(!req.session.userId){
			return res.redirect("/login")
		}
		let response = []
		let posts = await Post.find()
		for(let i = 0;i<posts.length;i++){
			const user = await User.findOne({_id:posts[i].userId},{username:1,_id:0})
			posts[i].userId = user.username
			response.push({username:user.username,postId:posts[i]._id,caption:posts[i].caption,imagePathname:posts[i].imagePathname})
			
			
		}
		res.status(200).json({posts:response})}catch(err){
			console.log(err)
		}
})
router.get("/api/user",async(req,res)=>{
	if (!req.session.userId){
		return res.redirect("/login")
	}

	const user = await User.findOne({_id:req.session.userId},{username:1,phone:1,_id:0})
	if (!user){
		return res.json({err:"Unfortunately the server is having problems with the user data right now"})
	}
	res.status(200).json(user)
})

module.exports = router
