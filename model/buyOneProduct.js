import mongoose from "mongoose";

const buyOneProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    buyOneProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null
    },
    totalAmount: {
        type: String,
        trim: true,
        default: 0
    },
    totalOrder: {
        type: String,
        trim: true,
        default: null
    },
    isBuying: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const BuyOneProduct = mongoose.model('BuyOneProduct', buyOneProductSchema);

export default BuyOneProduct;