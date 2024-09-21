import { baseUrl } from "../../../common/constants/configConstants";

export default class CartItemsResource {
    constructor(data, findImage) {

        const products = data !== null ? data.map(data => {

            const matchingImages = findImage.find(image => image.productId.toString() === data._id.toString());
            // const images = matchingImages.map(image => baseUrl(image.image));

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
                description: data.description,
                category: filteredData.category.name,
                subCategory: filteredData.subCategory && filteredData.subCategory.name ? filteredData.subCategory.name : null
            };
        }) : null;

        this.products = products

    }

    formatPrice(price) {
        const formattedPrice = parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formattedPrice;
    }

}