import mongoose from "mongoose";

const saveHistorySchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubAdmin"
    },
    role: {
        type: String,
        default: null
    },
    saveAdminsKeywords: {
        type: Array,
        default: null
    },
    saveUsersKeywords: {
        type: Array,
        default: null
    },
    saveProductsKeywords: {
        type: Array,
        default: null
    },
    saveDraftProductsKeywords: {
        type: Array,
        default: null
    },
    saveQuickSellOrderKeywords: {
        type: Array,
        default: null
    },
    savePurchasedOrderKeywords: {
        type: Array,
        default: null
    }
}, {
    timestamps: true
});

const SaveHistory = mongoose.model('SaveHistory', saveHistorySchema);

export default SaveHistory;