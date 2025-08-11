import { Router } from "express";
import { loginUserController, logoutController, registerUserController, removeImageFromClodinary, userAvatarController, verifyEmailController } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";


const userRouter = Router ()
userRouter.post('/register', registerUserController)
userRouter.post('/verifyEmail', verifyEmailController)
userRouter.post('/login', loginUserController)
userRouter.get('/logout',auth, logoutController)
userRouter.put('/user-avatar',auth,upload.array('avatar'), userAvatarController)
userRouter.delete('/deleteImage',auth,removeImageFromClodinary)


export default userRouter;