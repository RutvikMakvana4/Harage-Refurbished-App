import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    providerId: {
        type: String,
        trim: true
    },
    fullName: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        trim: true,
        default: null,
        // unique : true,
        lowercase: true,
        index: {
            unique: true
        }
    },
    countryCode: {
        type: String,
        trim: true,
        default: null
    },
    phone: {
        type: String,
        trim: true,
        default: null,
    },
    password: {
        type: String,
        trim: true,
        default: null
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    isSocial: {
        type: Boolean,
        default: false
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    refKey: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Users = mongoose.model('Users', usersSchema);

export default Users;