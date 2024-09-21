import mongoose from "mongoose";

const reportProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        trim: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuyOrder',
        default: null
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    type: {
        type: Number,        // 1 => Full order report || 2 => Product Report
        default: null
    },
    reportReason: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reportlist',
    },
    reportDescription: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const ReportProduct = mongoose.model('ReportProduct', reportProductSchema);

export default ReportProduct;