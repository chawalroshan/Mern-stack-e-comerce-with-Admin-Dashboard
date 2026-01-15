import mongoose from 'mongoose';

// Define the payment schema
const paymentSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    product_id: {
        type: String, 
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["INITIATED", "PENDING", "COMPLETE", "FAILED", "REFUNDED"],
        default: "PENDING",
    },
    payment_gateway: {
        type: String,
        required: true,
        enum: ["esewa", "khalti", "cash_on_delivery"],
        default: "esewa"
    },
    transaction_data: {
        type: Object,
        default: {}
    },
    verified_at: {
        type: Date,
    },
    failed_at: {
        type: Date,
    },
    refunded_at: {
        type: Date,
    }
}, {
    timestamps: true,
});

// Create the payment model from the schema
const Payment = mongoose.model("Payment", paymentSchema);

// Export the model as default
export default Payment;