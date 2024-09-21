import moment from "moment";

export default class SocialResource {
    constructor(data) {
        this._id = data._id;
        this.providerId = data.providerId
        this.fullName = data.fullName
        this.email = data.email
        this.countryCode = data.countryCode
        this.phone = data.phone
        this.image = data.image
        this.isSocial = data.isSocial
        this.joinedAt = moment(data.createdAt).unix()
    }
}