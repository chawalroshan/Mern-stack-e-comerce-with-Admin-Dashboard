import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    interactionType: {
        type: String,
        enum: ['view', 'add_to_cart', 'purchase', 'wishlist'],
        required: true
    },
    interactionScore: {
        type: Number,
        default: 1,
        min: 0.1,
        max: 10
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    indexes: [
        { userId: 1, productId: 1, interactionType: 1 },
        { userId: 1, timestamp: -1 }
    ]
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;