import mongoose from "mongoose";

const buyOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    orderId: {
        type: String,
        trim: true,
        default: null
    },
    orderDate: {
        type: Date,
        trim: true,
        default: null
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    buyProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BuyOneProduct",
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
    actionType: {
        type: String,    // 0 -  buy Now || 1 - addToCart 
        default: 0
    },
    pickupScheduled: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Number,  // 1 -> Order placed  |  2 -> Payment Pending  |  3 -> Payment Confirmed  |  4 -> Completed  |  5 -> Packed  |  6 -> Shipped  |  7 -> In Transit  |  8 -> Out for Delivery  |  9 -> Delivered  |  10 -> Cancelled  |  11 -> Failed Delivery  |  12 -> Returned  |  13 -> Refunded  |  14 -> Exchange Requested  |  15 -> Exchange Completed
        default: 1
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
    paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stripecard",
        default: null
    },
    isPaymentCompleted: {
        type: Boolean,
        default: false
    },
    deliveryDate: {
        type: Date,
        default: null
    },
    assignMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubAdmin",
        default: null
    },
    isAssigned: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const BuyOrder = mongoose.model('BuyOrder', buyOrderSchema);

export default BuyOrder;
