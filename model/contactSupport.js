import mongoose from "mongoose";

const contactSupportSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type : String,
        required: true,
    }
}, {
    timestamps: true
});

const ContactSupport = mongoose.model('contactsupport', contactSupportSchema);

export default ContactSupport;