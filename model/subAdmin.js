import mongoose from "mongoose";

const subAdminSchema = new mongoose.Schema({
    image: {
        type: String,
        default: null
    },
    fullName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        trim: true,
        default: null,
        lowercase: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        trim: true,
        default: null
    },
    assignRoles: {
        type: Array,
        default: null
    }
}, { timestamps: true });

const SubAdmin = mongoose.model('SubAdmin', subAdminSchema);

export default SubAdmin;
