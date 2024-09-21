import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const ReturnList = mongoose.model('returnlist', returnSchema);

export default ReturnList;