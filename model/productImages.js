import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema({
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        default: null
    },
    subSubCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSubCategory",
        default: null
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    image: {
        type: String
    }
}, { timestamps: true });

const ProductImages = mongoose.model('ProductImages', productImageSchema);

export default ProductImages;