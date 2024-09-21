import mongoose from "mongoose";

const userLogsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    ipAddress: {
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

const UserLogs = mongoose.model('UserLogs', userLogsSchema);

export default UserLogs;