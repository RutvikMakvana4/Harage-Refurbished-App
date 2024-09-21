import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    image: {
        type: String,
        trim: true,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    formData: {
        type: String,
        default: null
    },
    buyerData: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;

