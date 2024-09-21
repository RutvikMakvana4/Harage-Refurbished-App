import moment from "moment/moment";

export default class SellingOrderResource {
    constructor(data) {

        const items = data !== null ? data.map(data => {

            const filteredData = {};

            for (const key in data) {
                if (data[key] !== null) {
                    filteredData[key] = data[key];
                }
            }

            // const sellingItemsDetails = filteredData.sellingItems.map(item => {
            //     return {
            //         _id: item._id,
            //         productName: item.productName
            //     }
            // });

            return {
                _id: filteredData._id,
                orderId: filteredData.orderId,
                orderDate: moment(filteredData.orderDate).unix(),
                // sellingItems: sellingItemsDetails,
                status: filteredData.status,
                isAssigned: filteredData.isAssigned,
                assignMember: filteredData.assignMember ? filteredData.assignMember.fullName : null,
                paymentType:
                filteredData.paymentMethod && filteredData.paymentMethod.type
                  ? filteredData.paymentMethod.type
                  : null,
            };
        }) : null;

        this.items = items
    }
}