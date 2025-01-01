import express from "express";
import userRouter from './routes/user.route.js';
import cors from 'cors';
import cookieParser from "cookie-parser";

export const app = express();

// Dynamically set the Access-Control-Allow-Origin header to match the request's origin
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // In development, allow requests from any origin
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        } else {
            // In production, allow requests only from specific origins
            const allowedOrigins = ['https://my-bill-buddy1.vercel.app'];
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Ensure to set extended: true for parsing application/x-www-form-urlencoded

app.use('/user', userRouter);
