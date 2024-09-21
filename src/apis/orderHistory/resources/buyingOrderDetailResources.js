import { baseUrl } from "../../../common/constants/configConstants";
import moment from "moment";

export default class BuyingOrderDetailsResource {
    constructor(details, data, findImage) {

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
                description: filteredData.description,
                brand: filteredData.brand,
                otherBrand: filteredData.otherBrand ? filteredData.otherBrand : null,
                price: this.formatPrice(filteredData.price),
                categoryId: filteredData.category._id,
                category: filteredData.category.name,
                subcatgeoryId: filteredData.subCategory && filteredData.subCategory._id ? filteredData.subCategory._id : null,
                subCategory: filteredData.subCategory ? filteredData.subCategory.name : null,
                subSubCategory: filteredData.subSubCategory ? filteredData.subSubCategory.name : null,
                status: filteredData.status === 6 || filteredData.status === 7 ? filteredData.status : null
            };
        }) : null;

        const { shippingAddress: { _id, type, buildingName, company, floor, houseNumber, apartmentNo, street, additionalDirection, countryCode, mobileNumber, landlineNumber, latitude, longitude } } = details;

        this._id = details._id,
            this.orderId = details.orderId,
            this.orderDate = moment(details.orderDate).unix(),
            this.totalOrder = details.totalOrder,
            this.totalPrice = details.totalAmount,
            this.status = details.status,
            this.deliveryDate = details.deliveryDate ? moment(details.deliveryDate).unix() : null,                         // deliveryOrderDate !== null ? moment(deliveryOrderDate.deliveryDate).unix() : null,
            this.memberAssigned = details.assignMember != null ? details.assignMember.fullName : null,
            this.shipmentDetails = items,
            this.fullName = details.userId.fullName,
            this.paymentMethod = {
                _id: details.paymentMethod._id,
                cardName: details.paymentMethod.cardName,
                type: details.paymentMethod.type
            }
            this.shippingAddress = { _id, type, buildingName, company, floor, houseNumber, apartmentNo, street, additionalDirection, countryCode, mobileNumber, landlineNumber, latitude, longitude }

    }

    formatPrice(price) {
        const formattedPrice = parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formattedPrice;
    }

}
