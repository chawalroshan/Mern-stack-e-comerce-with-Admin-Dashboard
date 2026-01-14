import mongoose from 'mongoose';

const homeSliderSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true
    }, // Now stores Cloudinary URL
    link: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export default mongoose.model('homeSlider', homeSliderSchema);