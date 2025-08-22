import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addToMyListController, deleteToMyListController, getMyListController } from "../controllers/mylist.controller.js";

const myListRouter = Router ()
myListRouter.post('/add',auth, addToMyListController)
myListRouter.delete('/:id/delete',auth, deleteToMyListController)
myListRouter.get('/get',auth, getMyListController)


export default myListRouter
