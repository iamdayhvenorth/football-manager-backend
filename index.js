const express = require('express')
const connectDB = require("./db/connectDB")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require('./routes/authRoutes')


require("dotenv").config()

const PORT = process.env.PORT || 3500

const app = express()

// default middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())


app.get("/", (req,res) => {
    res.send("Page is Working fine")
})

// routes
app.use('/auth', authRoutes)


connectDB()
.then(()=>{
    console.log('database connected to mongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}).catch((err)=> console.log('Database not connected', err))
    

