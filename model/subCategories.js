import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    isSubSubCategory: {
        type: Boolean,
        default: false
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

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;


