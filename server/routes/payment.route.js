import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
    initiateEsewaPaymentController,
    esewaPaymentSuccessController,
    esewaPaymentFailureController
} from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post('/esewa/initiate', auth, initiateEsewaPaymentController);
paymentRouter.post('/esewa/success', auth, esewaPaymentSuccessController);
paymentRouter.post('/esewa/failure', auth, esewaPaymentFailureController);

export default paymentRouter;
