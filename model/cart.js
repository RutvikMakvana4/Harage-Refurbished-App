import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    addToCart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null
        }
    ],
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

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;


