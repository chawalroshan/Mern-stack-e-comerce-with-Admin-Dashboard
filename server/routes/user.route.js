import { Router } from "express";
import { loginUserController,
     logoutController,
     registerUserController,
     removeImageFromClodinary,
     userAvatarController, 
     verifyEmailController,
     updateUserDetails,
     forgotPasswordController,
     verifyForgotPasswordOtp,
     resetPassword, 
     refreshToken,
     userDetails} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";


const userRouter = Router ()
userRouter.post('/register', registerUserController)
userRouter.post('/verifyEmail', verifyEmailController)
userRouter.post('/login', loginUserController)
userRouter.get('/logout',auth, logoutController)
userRouter.put('/user-avatar',auth,upload.array('avatar'), userAvatarController)
userRouter.delete('/deleteImage',auth,removeImageFromClodinary)
userRouter.put('/:id',auth,updateUserDetails)
userRouter.post('/forgot-password',forgotPasswordController)
userRouter.post('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.post('/reset-password',resetPassword)
userRouter.put('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)



export default userRouter;