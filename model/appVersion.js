import mongoose from "mongoose";

const appVersionSchema = new mongoose.Schema({
    minVersion: {
        type: String,
        default: null
    },
    latestVersion: {
        type: String,
        default: null
    },
    appLink: {
        type: String,
        default: null
    },
    platform: {
        type: String,
        default: null
    },
    role: {                              // 0 - Customer | 1 - Super admin
        type: String,
        default: null
    }
}, { timestamps: true });

const AppVersion = mongoose.model('appversion', appVersionSchema);

export default AppVersion;