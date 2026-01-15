import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values but enforces uniqueness when present
    },
    items: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        }
    }],
    shippingAddress: {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        apartment: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'Nepal'
        }
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'esewa', 'card'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'placed'
    },
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Generate unique orderId before saving
orderSchema.pre('save', async function(next) {
    // Only generate if orderId is missing or empty
    if (!this.orderId || this.orderId.trim() === '') {
        try {
            // Generate unique orderId: ORD + timestamp + random string
            const timestamp = Date.now().toString(36).toUpperCase();
            const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
            const uniqueOrderId = `ORD-${timestamp}-${randomStr}`;
            
            // Check if this orderId already exists (using the model directly)
            const OrderModel = this.constructor;
            const existingOrder = await OrderModel.findOne({ orderId: uniqueOrderId });
            
            if (!existingOrder) {
                this.orderId = uniqueOrderId;
            } else {
                // If collision, add more randomness
                const extraRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
                this.orderId = `ORD-${timestamp}-${randomStr}-${extraRandom}`;
            }
        } catch (error) {
            console.error('Error generating orderId:', error);
            // Fallback orderId if generation fails
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 9).toUpperCase();
            this.orderId = `ORD-${timestamp}-${randomStr}`;
        }
    }
    next();
});

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
