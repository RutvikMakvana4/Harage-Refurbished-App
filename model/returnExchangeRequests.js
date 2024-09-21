import mongoose from "mongoose";

const returnExchangeRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        trim: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        trim: true
    },
    option: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "returnlist",
    },
    reason: {
        type: String,      // Return | Exchange
        default: null
    },
    image: [{
        type: String,
        default: null
    }]
}, {
    timestamps: true
});

const ReturnExchange = mongoose.model('ReturnExchange', returnExchangeRequestSchema);

export default ReturnExchange;