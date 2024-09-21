import mongoose from "mongoose";

const accessSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true
    },
    token: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
});

const AccessToken = mongoose.model('accesstoken', accessSchema);

export default AccessToken;