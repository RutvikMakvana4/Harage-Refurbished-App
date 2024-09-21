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

            return {
              _id: filteredData._id,
              orderId: filteredData.orderId,
              orderDate: moment(filteredData.orderDate).unix(),
              status: filteredData.status,
              paymentType:
                filteredData.paymentMethod && filteredData.paymentMethod.type
                  ? filteredData.paymentMethod.type
                  : null,
            };
        }) : null;

        this.items = items
    }
}