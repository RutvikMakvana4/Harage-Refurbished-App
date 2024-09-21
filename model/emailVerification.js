import mongoose from "mongoose";

const emailVerificationSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
    },
    emailOTP: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

const EmailVerification = mongoose.model('emailverification', emailVerificationSchema);

export default EmailVerification;