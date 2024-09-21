import mongoose from "mongoose";

const reportImageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportProduct'
    },
    image: {
        type: String,
        default: null
    }
}, { timestamps: true });


const ReportImages = mongoose.model('reportimage', reportImageSchema);

export default ReportImages;