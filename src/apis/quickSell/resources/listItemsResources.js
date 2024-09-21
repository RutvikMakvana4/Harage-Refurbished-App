import { baseUrl } from "../../../common/constants/configConstants";

export default class ItemListResource {
    constructor(data, findImage) {

        const items = data !== null ? data.map(data => {

            const matchingImages = findImage.find(image => image.itemId.toString() === data._id.toString());

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
                otherBrand: filteredData.otherBrand,
                price: this.formatPrice(filteredData.price),
                categoryId : filteredData.category._id,
                category: filteredData.category.name,
                subcatgeoryId: filteredData.subCategory && filteredData.subCategory._id ? filteredData.subCategory._id : null,

                subCategory: filteredData.subCategory ? filteredData.subCategory.name : null,
                // subSubcatgeoryId: filteredData.subSubCategory._id,
                subSubCategory: filteredData.subSubCategory ? filteredData.subSubCategory.name : null,
                // subSubCatgeoryData: JSON.parse(filteredData.subSubCategory.formData)
            };
        }) : null;


        this.items = items
    }
    
    formatPrice(price) {
        const formattedPrice = parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formattedPrice;
    }
}


