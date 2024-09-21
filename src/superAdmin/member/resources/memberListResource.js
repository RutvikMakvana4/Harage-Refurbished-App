import { baseUrl } from "../../../common/constants/configConstants";

export default class MemberListResource {
    constructor(data) {

        const members = data !== null ? data.map(memberData => {

            const filteredData = {};

            for (const key in memberData) {
                if (memberData[key] !== null) {
                    filteredData[key] = memberData[key];
                }
            }

            return {
                _id: filteredData._id,
                fullName: filteredData.fullName,
                email: filteredData.email,
                image: filteredData.image ? baseUrl(filteredData.image) : null,
                accessType: filteredData.accessType
            };
        }) : [];

        return members;
    }
}
