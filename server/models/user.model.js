import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide name']
    },
    email: {
        type: String,
        required: [true, 'Provide email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Provide password']
    },
    avatar: {
        type: String,
        default: ''
    },
    mobile: {
        type: Number,
        default: null
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    access_token: {
        type: String,
        default: ''
    },
    refresh_token: {
        type: String,
        default: ''
    },
    last_login_date: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'suspended'],
        default: 'Active'
    },
    address_detils: [{
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    }],
    shopping_cart: [{
        type: mongoose.Schema.ObjectId,
        ref: 'cartproduct'
    }],
    orderHistory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'order'
    }],
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    }
}, {
    timestamps: true
});


const UserModel = mongoose.model('User',userSchema)

export default UserModel