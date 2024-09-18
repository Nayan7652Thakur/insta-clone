import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { app, server } from './socket/Socket.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // This is the correct way to use urlencoded

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.use('/api/v2/user', userRoute);
app.use('/api/v2/post', postRoute);
app.use('/api/v2/message', messageRoute);

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "I'm coming from the backend",
        success: true,
    });
});

// Start server
server.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening at port ${PORT}🚀`); 
});
