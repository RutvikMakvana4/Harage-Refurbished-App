import mongoose from "mongoose";

const buyProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    orderId: {
        type: String,
        trim: true
    },
    orderDate: {
        type: Date,
        trim: true
    },
    addToCart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null
        }
    ],
    buyOneProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null
    },
    totalOrder: {
        type: String,
        trim: true,
        default: null
    },
    totalPrice: {
        type: String,
        trim: true,
        default: null
    },
    pickupScheduled: {
        type: String,
        trim: true
    },
    status: {
        type: Number,                    // 0 -> Pickup Pending  |  1 -> Completed  |  2 -> Cancelled
        default: 0
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        default: null
    },
    isBuying: {
        type: Boolean,
        default: false
    },
    isBuyOneProduct: {
        type: Boolean,
        default : false
    },
    paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stripecard",
        default: null
    },
    isPaymentCompleted: {
        type: Boolean,                   //  true -> Payment completed  ||  false -> Payment not completed
        default: false
    }
}, { timestamps: true });

const BuyProduct = mongoose.model('BuyProduct', buyProductSchema);

export default BuyProduct;
