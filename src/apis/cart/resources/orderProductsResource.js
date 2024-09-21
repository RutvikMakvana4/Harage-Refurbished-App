import { baseUrl } from "../../../common/constants/configConstants";

export default class OrderProductsResource {
    constructor(data, findImage) {

        const items = data !== null ? data.map(data => {

            const matchingImages = findImage.find(image => image.productId.toString() === data._id.toString());

            const filteredData = {};

            for (const key in data) {
                if (data[key] !== null) {
                    filteredData[key] = data[key];
                }
            }

            return {
                _id: filteredData._id,
                image: matchingImages !== undefined ? baseUrl(matchingImages.image) : null,
                productName: filteredData.productName,
                brand: filteredData.brand,
                price: this.formatPrice(filteredData.price),
                categoryId: filteredData.category._id,
                category: filteredData.category.name,
                subCategoryId: filteredData.subCategory && filteredData.subCategory._id ? filteredData.subCategory._id : null,
                subCategory: filteredData.subCategory ? filteredData.subCategory.name : null,
                subSubCategory: filteredData.subSubCategory ? filteredData.subSubCategory.name : null

            };
        }) : null;

        this.orderDetails = items

        for (const key in this) {
            if (this[key] === null) {
                delete this[key];
            }
        }
    }

    formatPrice(price) {
        const formattedPrice = parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formattedPrice;
    }

}
