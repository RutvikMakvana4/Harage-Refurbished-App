import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuyProduct',
    },
    paymentId: {
        type: String,
        default: null
    },
    paymentResponse: {
        type: String,
        default: null
    },
    paymentLink: {
        type: String,
        default: null
    },
    paymentMethod: {
        type: String,      //  1 -> Cash On Delivery | 2 -> Skipcash
        trim: true,
    },
    refundSuccess: {
        type: Boolean,
        default: false
    },
    refundAmount: {
        type: String,
        default: null
    },
    refundId: {
        type: String,
        default: null
    }
}, { timestamps: true });

const PaymentInvoice = mongoose.model('invoice', invoiceSchema);

export default PaymentInvoice