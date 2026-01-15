import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
    createNotificationController,
    getUserNotificationsController,
    markNotificationReadController,
    markAllNotificationsReadController,
    getUnreadNotificationCountController
} from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.post('/create', auth, createNotificationController);
notificationRouter.get('/user', auth, getUserNotificationsController);
notificationRouter.put('/:id/read', auth, markNotificationReadController);
notificationRouter.put('/read-all', auth, markAllNotificationsReadController);
notificationRouter.get('/unread-count', auth, getUnreadNotificationCountController);

export default notificationRouter;
