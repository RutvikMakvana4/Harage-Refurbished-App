import { baseUrl } from "../../../common/constants/configConstants";

export default class SingleCardResource {
    constructor(card) {
        let icon;

        switch (card.type) {
            case "0":
                icon = baseUrl("img/cards/apple pay.png");
                break;
            case "1":
                icon = baseUrl("img/cards/cash on delivery.png");
                break;
            case "2":
                icon = baseUrl(`img/cards/${card.brand}.png`);
                break;
            default:
                icon = baseUrl("img/cards/default.png");
                break;
        }

        return {
            _id: card._id,
            last4: card.lastNumber,
            exp_month: card.expMonth,
            exp_year: card.expYear,
            card_type: card.brand,
            icon: icon
        };
    }
}
