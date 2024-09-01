import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'


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


app.use('/api/v2/user', userRoute);
app.use('/api/v2/post', postRoute);
app.use('/api/v2/message', messageRoute);

app.listen(PORT, () =>{
    connectDB()
    console.log(`server listen at post ${PORT}`);
})