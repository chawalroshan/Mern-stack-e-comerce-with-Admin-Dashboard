import mongoose from "mongoose";

const myListSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref:'product'
    },

    userId: {
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },

    productTitle: {
        type: String,
        required: true
    },
    images:[
        {
        type: String,
        required: true
        }
    ],
    rating:{
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0
    },
    oldePrice: {
        type: Number,
        default: 0
    },
    brand: {
        type: String,
        default: ''
    },
    discount:{
        type: Number,
        required: true
    }
}, {
    timestamps: true

});

const MyListModel = mongoose.model('MyList',myListSchema)

export default MyListModel