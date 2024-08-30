import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRouter from './routes/user.route.js'

dotenv.config({})


const PORT = process.env.PORT || 3000;


const app = express()

app.get("/", (req,res) => {
    return res.status(200).json({
        message:"Im' coming from backend",
      success:true   
    })
})

//widdlewares

app.use(express.json())
app.use(cookieParser());
app.use(urlencoded({extended:true}))
const corsOption = {
    origin:'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOption))


app.use("api/v1/user", userRouter)

app.listen(PORT, () =>{
 connectDB()
    console.log(`server listen at post ${PORT}`);
})