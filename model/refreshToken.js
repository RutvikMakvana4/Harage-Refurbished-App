import mongoose from "mongoose";

const refreshSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true
    },
    accessToken: {
        type: String
    },
    token: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
});

const RefreshToken = mongoose.model('refreshtoken', refreshSchema);

export default RefreshToken;