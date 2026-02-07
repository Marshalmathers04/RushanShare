const express = require("express")
const multer = require("multer")
const path = require("path")
const rateLimit = require("express-rate-limit")
const bcrypt = require("bcrypt")

const User = require("../models/User.js")
const Post = require("../models/Post.js")

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many attempts. Try again after 15 minutes"
    })
  }
})


router.get("/login",(req,res)=>{
	res.sendFile(path.join(__dirname,"../assets/views/login.html"))
})

router.get("/signup",(req,res)=>{
	res.sendFile(path.join(__dirname,"../assets/views/register.html"))
})

router.post("/signup",async (req,res)=>{
	try{
		const {username,password,phone} = req.body
		const regex=/^\+998\d{9}$/
		let route = "/verifyphone"
		const usernameexists = await User.findOne({username})
		const phoneexists = await User.findOne({phone})
		if (!regex.test(phone)){
			return res.status(409).json({error:"the phone number is invalid"})
		}
		if (usernameexists||phoneexists){
			return res.status(409).json({error:"The username or phone already exists"})
		}
		const randInt = Math.floor(Math.random()*900000)+100000
		const hash = await bcrypt.hash(password,10)
		const user = await User.create({username,hash,phone,verificationcode:randInt})
		req.session.userId = user._id
		res.status(200).json({route})
	}catch(err){
		return res.status(500).json({error:err.message})
	}
	
})
router.get("/viewusers",async (req,res)=>{
	const users = await User.find()
	res.status(200).json(users)
	
})
router.post("/login",async (req,res)=>{
	try{	
		const {username,password} = req.body
		const user = await User.findOne({username})
		let route = "/main"
		if (!user){
			return res.status(404).json({error:"username hasnt been registered yet.Please sign up"})	

		}
		const isMatch = await bcrypt.compare(password,user.hash)
		if (!isMatch){
			return res.status(400).json({error:"Wrong password"})
		}
		if(!user.verifiedphone){
			route = "/verifyphone"
		}
		req.session.userId = user._id
		res.status(200).json({route})
	}catch(err){
		return res.status(500).json({error:"Server not responding"})
	}
})
router.get("/verifyphone",async (req,res)=>{
	if(!req.session.userId){
		return res.sendFile(path.join(__dirname,"../assets/views/login.html"))
	}
	res.sendFile(path.join(__dirname,"../assets/views/verifyphone.html"))
})
router.post("/verifyphone",loginLimiter,async (req,res)=>{
	const user = await User.findOne({_id:req.session.userId})
	if (req.body.code!==user.verificationcode){
		console.log(`${user.username} just typed in the wrong code,ur code: ${typeof(req.body.code)},the one it should be: ${typeof(user.verificationcode)}`)
		return res.status(409).json({error:"Wrong code"})
	}
	user.verifiedphone = true
	await user.save()
	res.status(200).json({route:"/main"})
})
router.get("/main",(req,res)=>{
	if (!req.session.userId){
		return res.redirect("/login")
	}
	res.sendFile(path.join(__dirname,"../assets/views/main.html"))
})

const storage = multer.diskStorage({
	destination:(req,file,cb)=>{
		cb(null,path.join(__dirname,"../assets/images/fullquality"))
	},
	filename:(req,file,cb)=>{
		const ext = path.extname(file.originalname)
		const name = path.basename(file.originalname,ext)
		const newName = `${name}-${Date.now()}${ext}` 
		cb(null,newName)
	
	}

})
const upload = multer({storage})
router.post("/addpost",upload.single('imageFile'),async (req,res)=>{
	if (!req.file){
		return res.status(400).json({error:"file not sent"})
	}
	const caption = req.body.caption
	const file = req.file.filename
	const post = await Post.insertOne({caption,userId:req.session.userId,imagePathname:`images/fullquality/${file}`,coordinates:JSON.parse(req.body.coordinates)})
	res.redirect("/main")
})




module.exports = router
