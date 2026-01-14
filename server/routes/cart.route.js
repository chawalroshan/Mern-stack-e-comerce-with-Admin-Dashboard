import { Router } from "express";   
import auth from "../middlewares/auth.js";
import {addToCartItemController, deleteCartItemController, getCartItemController, updateCartItemQtyController, syncCartController} from '../controllers/cart.controller.js'


const cartRouter = Router ()
cartRouter.post('/add',auth, addToCartItemController)
cartRouter.post('/sync', auth, syncCartController)
cartRouter.get('/get',auth, getCartItemController)
cartRouter.put('/update-qty',auth, updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth, deleteCartItemController)

export default cartRouter;