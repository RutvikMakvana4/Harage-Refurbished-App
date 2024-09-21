import { baseUrl } from "../../../common/constants/configConstants";

export default class OneProductResource {
    constructor(data, findImage) {
        const matchingImages = findImage.filter(image => image.productId.toString() === data._id.toString());
        // const images = matchingImages.map(image => baseUrl(image.image));

        const image = matchingImages.map(image => ({
            _id: image._id,
            url: baseUrl(image.image)
        }));

        this._id = data._id,
            this.productName = data.productName,
            this.productDescription = data.productDescription,
            this.brand = data.brand,
            this.model = data.model,
            this.screenSize = data.screenSize,
            this.screenType = data.screenType,
            this.additionalFeatures = data.additionalFeatures,
            this.resolution = data.resolution,
            this.smartTv = data.smartTv,
            this.hdr = data.hdr,
            this.condition = data.condition,
            this.price = data.price,
            this.warranty = data.warranty,
            this.additionalFeatures = data.additionalFeatures,
            this.image = image.length > 0 ? image : null

        for (const key in this) {
            if (this[key] === null) {
                delete this[key];
            }
        }
    }
}
