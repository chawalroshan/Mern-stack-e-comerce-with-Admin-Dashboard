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
import homeSliderRouter from './routes/homeSlider.route.js';
import orderRouter from './routes/order.route.js';
import notificationRouter from './routes/notification.route.js';
import paymentRouter from './routes/payment.route.js';


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

// eSewa Configuration //Later we will serve it from .env 
const esewaConfig = {
  merchantId: "EPAYTEST", // Replace with your eSewa Merchant ID
  successUrl: "http://localhost:5173/payment-success", //Replace with front-end success route page
  failureUrl: "http://localhost:5173/payment-failure", //Replace with front-end failure route page
  esewaPaymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  secret: "8gBm/:&EnhH.1/q",
};


app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/myList', myListRouter)
app.use('/api/address',addressRouter)
app.use('/api/homeSlider',homeSliderRouter)
app.use('/api/orders', orderRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/payment', paymentRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
});