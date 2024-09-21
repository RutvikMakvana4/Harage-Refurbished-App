import mongoose from "mongoose";

const orderReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        trim: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuyOrder',
        trim: true
    },
    writeYourExperience: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const OrderReview = mongoose.model('OrderReview', orderReviewSchema);

export default OrderReview;