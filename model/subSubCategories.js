import mongoose from "mongoose";

const subSubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
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

const SubSubCategory = mongoose.model('SubSubCategory', subSubCategorySchema);

export default SubSubCategory;
