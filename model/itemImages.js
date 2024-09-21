import mongoose, { mongo } from "mongoose";

const itemImageSchema = new mongoose.Schema({
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
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    image: {
        type: String
    }
}, { timestamps: true });

const ItemImages = mongoose.model('ItemImages', itemImageSchema);

export default ItemImages;