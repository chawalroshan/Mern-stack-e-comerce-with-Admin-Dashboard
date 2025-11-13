import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js';
import myListRouter from './routes/myList.route.js';
import addressRouter from './routes/address.route.js';
import SubCategoryRouter from './routes/subCategory.routes.js';


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


app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/SubCategory',SubCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/myList', myListRouter)
app.use('/api/address',addressRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
});