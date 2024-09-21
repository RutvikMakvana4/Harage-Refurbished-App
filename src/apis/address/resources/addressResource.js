import { baseUrl } from "../../../common/constants/configConstants";

export default class AddressResource {
    constructor(data) {

        const addresses = data !== null ? data.map(data => {

            const filteredData = {};

            for (const key in data) {
                if (data[key] !== null) {
                    filteredData[key] = data[key];
                }
            }

            return {
                _id: filteredData._id,
                type: filteredData.type,
                image: data.type === "0" ? baseUrl('img/address-images/office.png') : data.type === "1" ? baseUrl('img/address-images/home.png') : baseUrl('img/address-images/apartment.png'),
                buildingName: filteredData.buildingName,
                company: filteredData.company,
                floor: filteredData.floor,
                houseNumber: filteredData.houseNumber,
                apartmentNo: filteredData.apartmentNo,
                street: filteredData.street,
                additionalDirection: filteredData.additionalDirection !== null ? filteredData.additionalDirection : null,
                countryCode: filteredData.countryCode,
                mobileNumber: filteredData.mobileNumber,
                landlineNumber: filteredData.landlineNumber !== null ? filteredData.landlineNumber : null,
                isDefault: filteredData.isDefault,
                latitude: filteredData.latitude,
                longitude: filteredData.longitude
            };
        }) : null;

        this.addresses = addresses

    }
}