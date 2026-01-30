const express = require("express")
const path = require("path")


const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo").default

const routes = require("./routes/router.js")
const postApi = require("./routes/PostAPI.js")
const app = express()
const PORT = 3000



app.use(express.static("assets"))
app.use(express.json())
mongoose.connect("mongodb://127.0.0.1:27017/rushanshare")
.then(console.log("mongoDB connected"))
.catch(err=>console.log("and error"))


const store = MongoStore.create({
	mongoUrl:"mongodb://127.0.0.1:27017/rushanshare",
	collectionName:"sessions",
	ttl:14*24*60*60,
	autoRemove:'interval',
	autoRemoveInterval:10
})


app.use(express.urlencoded({extended:true}))
app.use(session({
  secret: 'nigga',
  resave: false, 
  saveUninitialized: true, 
	store:store,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 3600000 
  }
}));


app.use(postApi)
app.use(routes)
app.get("/",(req,res)=>{
	res.sendFile(path.join(__dirname,"/assets/views/login.html"))
})
app.listen(PORT,()=>{
	console.log(`Listenning on port:${3000}`)
})
