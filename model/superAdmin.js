import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        default: null
    },
    email: {
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
        default: null
    },
    isSuperAdmin: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

export default SuperAdmin;