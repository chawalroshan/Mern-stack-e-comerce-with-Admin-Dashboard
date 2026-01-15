import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
    placeOrderController,
    getUserOrdersController,
    getAdminOrdersController,
    getOrderByIdController,
    updateOrderStatusController
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post('/place', auth, placeOrderController);
orderRouter.get('/user-orders', auth, getUserOrdersController);
orderRouter.get('/admin-orders', auth, getAdminOrdersController);
orderRouter.get('/:id', auth, getOrderByIdController);
orderRouter.put('/:id/status', auth, updateOrderStatusController);

export default orderRouter;
