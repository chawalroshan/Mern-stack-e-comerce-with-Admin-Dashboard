import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailFun from "../config/sendEmail.js";
import verificationEmail from "../utils/verifyEmailTemplate.js";

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
            token
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

