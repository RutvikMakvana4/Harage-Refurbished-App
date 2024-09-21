import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        trim: true,
        default: null
    },
    countryCode: {
        type: String,
        trim: true,
        default: null
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    password: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    refKey: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;