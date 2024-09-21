import { baseUrl } from "../../../common/constants/configConstants";

export default class CardsResource {
    constructor(cards) {
        return cards.map((data) => {
            let icon;

            switch (data.type) {
                // case "0":
                //     icon = baseUrl("img/paymentCards/apple_pay.jpg");
                //     break;
                case "1":
                    icon = baseUrl("img/paymentCards/cash_on_delivery.png");
                    break;
                case "2":
                    icon = baseUrl(`img/paymentCards/Skip_cash_icon.png`);
                    break;
                default:
                    icon = baseUrl("img/cards/default.png");
                    break;
            }

            return {
                _id: data._id,
                type: data.type,
                cardName: data.cardName,
                // fullName: data.fullName,
                // last4: data.lastNumber,
                // exp_month: data.expMonth,
                // exp_year: data.expYear,
                // card_type: data.brand,
                icon: icon
            };
        });
    }
}
