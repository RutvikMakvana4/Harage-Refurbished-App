import { baseUrl } from "../../../common/constants/configConstants"

export default class ProductCardDeatil {
    constructor(findProduct, findImage) {
        const result = [];

        findProduct.forEach(data => {

            const matchingImage = findImage.find(image => image.productId.toString() === data._id.toString());

            const item = {
                _id: data._id,
                category: data.categoryId && data.categoryId.name !== null ? data.categoryId.name : null,
                categoryId: data.categoryId !== null ? data.categoryId._id : null,
                subCategory: data.subCategoryId && data.subCategoryId.name !== null ? data.subCategoryId.name : null,
                subCategoryId: data.subCategoryId !== null ? data.subCategoryId._id : null,
                subSubCategory: data.subSubCategoryId && data.subSubCategoryId.name !== null ? data.subSubCategoryId.name : null,
                subSubCategoryId: data.subSubCategoryId !== null ? data.subSubCategoryId._id : null,
                productName: data.productName,
                price: data.price,
                description: data.description,
                image: matchingImage !== undefined ? baseUrl(matchingImage.image) : null
            };

            result.push(item);
        });
        return result;

    }
}