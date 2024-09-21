import mongoose from "mongoose";

const adminLogsSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubAdmin"
    },
    ipAddress: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: null
    },
    action: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: null
    },
    time: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const AdminLogs = mongoose.model('AdminLogs', adminLogsSchema);

export default AdminLogs;