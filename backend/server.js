import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();
const app = express();
connectDB();

app.use(cors({ 
    origin: [
        "https://college-management-client.onrender.com",
        "http://localhost:3000"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    res.cookie('token', req.cookies.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: '.onrender.com'
    });
    next();
});

app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
