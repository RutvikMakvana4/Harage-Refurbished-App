import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const ReportList = mongoose.model('reportlist', reportSchema);

export default ReportList;