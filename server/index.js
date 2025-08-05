import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDb.js';

const PORT = process.env.PORT || 8000; 

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

app.get('/', (request, response) => {
    response.json({
        message: "server is running " + PORT
    });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
});