import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailFun from "../config/sendEmail.js";
import verificationEmail from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



// Configuration
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: 'Provide email, name, and password',
                error: true,
                success: false
            });
        }

         const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return response.status(400).json({
                message: 'User already registered with this email',
                error: true,
                success: false
            });
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const newUser = new UserModel({
            email,
            password: hashPassword,
            name,
            otp: verifyCode,
            otpExpires: Date.now() + 300000,
        });

        console.log("Attempting to save user:", {
            name: newUser.name,
            email: newUser.email,
            otp: newUser.otp,
            otpExpires: newUser.otpExpires
        });

        const save = await newUser.save(); // ✅ Save the new user
        console.log("User saved successfully:", save._id);
        console.log("Full saved user object:", JSON.stringify(save, null, 2));


        // Send verification email (non-blocking)
        try {
            await sendEmailFun({
                sendTo: email,
                subject: 'Verify your email - EcommerceAppMERN',
                text: '',
                html: verificationEmail(name, verifyCode)
            });
        } catch (err) {
            console.log("Email send failed:", err.message);
        }

        // Create JWT
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        return response.status(201).json({
            message: 'User registered successfully! Please verify your email.',
            success: true,
            error: false,
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                verify_email: newUser.verify_email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return response.status(400).json({
                message: 'Validation failed',
                errors: validationErrors,
                error: true,
                success: false
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return response.status(400).json({
                message: 'User already registered with this email',
                error: true,
                success: false
            });
        }

        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}


export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body;

        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return response.status(400).json({
                error: true,
                success: false,
                message: 'User not found'
            });
        }

        if (user.verify_email) {
            return response.status(400).json({
                error: true,
                success: false,
                message: 'Email already verified'
            });
        }

        const isCodeValid = user.otp === otp;
        const isNotExpired = user.otpExpires > Date.now();

        if (isCodeValid && isNotExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return response.status(200).json({
                error: false,
                success: true,
                message: 'Email verified successfully'
            });

        } else if (!isCodeValid) {
            return response.status(400).json({
                error: true,
                success: false,
                message: 'Invalid OTP'
            });
        } else {
            return response.status(400).json({
                error: true,
                success: false,
                message: 'OTP expired'
            });
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}


export async function loginUserController(request, response) {
    try {
        const { email, password } = request.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: 'User not registered',
                error: true,
                success: false
            });
        }

        if (user.status !== 'Active') {
            return response.status(400).json({
                message: 'Contact the admin',
                error: true,
                success: false
            });
        }

        if (user.verify_email !== true) {
            return response.status(400).json({
                message: 'Your Email is not verify yet please verify your email first',
                error: true,
                success: false
            });
        }


        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            return response.status(400).json({
                message: 'Check your password',
                error: true,
                success: false
            });
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        await UserModel.findByIdAndUpdate(user._id, {
            last_login_date: new Date()
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        };

        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);

        return response.json({
            message: 'Login successfully',
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}



export async function logoutController(request, response) {
    try {
        const userid = request.userId; //auth middlewares

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        };

        response.clearCookie('accessToken', cookiesOption);
        response.clearCookie('refreshToken', cookiesOption);

        const removerefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ''
        });

        return response.json({
            message: 'Logout successfully',
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


//Image upload
var imagesArr = [];

export async function userAvatarController(request, response) {
    try {
        let imagesArr = [];
        const userId = request.userId;
        const images = request.files; // multiple file uploads

        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return response.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        // Delete old avatar from Cloudinary if exists
        if (user.avatar) {
            const urlArr = user.avatar.split('/');
            const image = urlArr[urlArr.length - 1];
            const imageName = image.split('.')[0];
            if (imageName) {
                await cloudinary.uploader.destroy(imageName);
            }
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        // Upload new images
        for (let i = 0; i < (images?.length || 0); i++) {
            const uploadResult = await cloudinary.uploader.upload(images[i].path, options);
            imagesArr.push(uploadResult.secure_url);

            // Delete file from local uploads folder
            fs.unlinkSync(`uploads/${images[i].filename}`);
        }

        // Update user avatar
        user.avatar = imagesArr[0] || user.avatar;
        await user.save();

        return response.status(200).json({
            _id: userId,
            avatar: user.avatar
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


//Remove image from cloudinary

export async function removeImageFromClodinary(request, response) {
    try {
        const imgUrl = request.query.img;
        if (!imgUrl) {
            return response.status(400).json({ message: 'Image URL is required' });
        }

        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split('.')[0]; // public_id expected by Cloudinary

        if (!imageName) {
            return response.status(400).json({ message: 'Invalid image URL' });
        }
        const result = await cloudinary.uploader.destroy(imageName);

        return response.status(200).json({
            message: 'Image deleted successfully',
            result: result.result,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Failed to delete image',
        });
    }
}



//update user details
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId; // from auth middleware
        const { name, email, mobile, password } = request.body;

        const userExist = await UserModel.findById(userId);
        if (!userExist) {
            return response.status(400).send('The user cannot be updated!');
        }

        let verifyCode = null;

        if (email && email !== userExist.email) {
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        }

        let hashPassword;
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        } else {
            hashPassword = userExist.password;
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name,
                mobile: mobile,
                email: email,
                verify_email: email !== userExist.email ? false : true,
                password: hashPassword,
                otp: verifyCode ? verifyCode : null,
                otpExpires: verifyCode ? Date.now() + 600000 : null
            },
            { new: true }
        );

        if (email && email !== userExist.email) {
            // send verification email
            await sendEmailFun({
                sendTo: email,
                subject: 'Verify email from EcommerceMERNApp',
                text: '',
                html: verificationEmail(name, verifyCode)
            });
        }

        return response.json({
            message: 'User updated successfully',
            error: false,
            success: true,
            user: updateUser
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//forgot password 
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        } else {
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            user.otp = verifyCode;
            user.otpExpires = Date.now() + 600000;

            await user.save();

            await sendEmailFun({
                sendTo: email,
                subject: 'Verify OTP from EcommerceMERNApp',
                text: '',
                html: verificationEmail(user.name, verifyCode)
            });

            return response.json({
                message: 'Check your email',
                error: false,
                success: true
            });
        }



    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}


// verify forgot password OTP
export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required fields: email, otp.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        if (user.otpExpires < Date.now()) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            });
        }

        if (otp !== user.otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        // Clear OTP fields after successful verification
        user.otp = "";
        user.otpExpires = "";
        await user.save();

        return response.json({
            message: "OTP verified successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}


// reset password 
export async function resetPassword(request, response) {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = request.body;

        if (!email || !oldPassword || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: 'Provide required fields: email, oldPassword, newPassword, confirmPassword',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        // ✅ check old password
        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
            return response.status(400).json({
                message: "Old password is incorrect",
                error: true,
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "New password and confirm password must be the same",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        // ✅ update password properly
        user.password = hashPassword;
        await user.save();

        return response.json({
            message: 'Password updated successfully',
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}



//refresh token controller
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(' ')[1] //bearer token

        if (!refreshToken) {
            return response.status(401).json({
                message: 'Invalid token',
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return response.status(401).json({
                message: 'token is expired',
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id;
        const newAccessToken = await generateAccessToken(userId)
        const newRefreshToken = generateRefreshToken(userId);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        response.cookie('accessToken', newAccessToken, cookiesOption)
        response.cookie('refreshToken', newRefreshToken, cookiesOption);

        return response.json({
            message: 'New Access token generated',
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

//get login user details 
export async function userDetails(request, response) {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId).select('-password -refresh_token');

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: 'User details',
            data: user,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}
