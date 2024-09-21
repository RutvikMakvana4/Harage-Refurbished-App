import { baseUrl } from "../../../common/constants/configConstants";

export default class ProductListResource {
    constructor(data, findImage) {

        const products = data !== null ? data.map(data => {

            const matchingImages = findImage.find(image => image.productId.toString() === data._id.toString());

            const filteredData = {};

            for (const key in data) {
                if (data[key] !== null) {
                    filteredData[key] = data[key];
                }
            }

            return {
                _id: filteredData._id,
                category: data.categoryId && data.categoryId.name !== null ? data.categoryId.name : null,
                categoryId: data.categoryId !== null ? data.categoryId._id : null,
                subCategory: data.subCategoryId && data.subCategoryId.name !== null ? data.subCategoryId.name : null,
                subCategoryId: data.subCategoryId !== null ? data.subCategoryId._id : null,
                subSubCategory: data.subSubCategoryId && data.subSubCategoryId.name !== null ? data.subSubCategoryId.name : null,
                subSubCategoryId: data.subSubCategoryId !== null ? data.subSubCategoryId._id : null,
                productName: filteredData.productName,
                price: filteredData.price,
                description: filteredData.description,
                image: matchingImages !== undefined ? baseUrl(matchingImages.image) : null
            };
        }) : null;

        this.products = products
    }
}