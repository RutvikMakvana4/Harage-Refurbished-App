import { baseUrl } from "../../../common/constants/configConstants";

export default class OneAddressResource {
    constructor(data) {
        this._id = data._id,
            this.type = data.type,
            this.buildingName = data.buildingName,
            this.company = data.company,
            this.floor = data.floor,
            this.houseNumber = data.houseNumber,
            this.apartmentNo = data.apartmentNo,
            this.street = data.street,
            this.additionalDirections = data.additionalDirections,
            this.countryCode = data.countryCode,
            this.mobileNumber = data.mobileNumber,
            this.landlineNumber = data.landlineNumber,
            this.latitude = data.latitude,
            this.longitude = data.longitude
            this.image = this.type === "0" ? baseUrl('img/address-images/office.png') : this.type === "1" ? baseUrl('img/address-images/home.png') : baseUrl('img/address-images/apartment.png');

        for (const key in this) {
            if (this[key] === null) {
                delete this[key];
            }
        }
    }
}