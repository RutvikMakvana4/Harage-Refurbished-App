import { baseUrl } from "../../../common/constants/configConstants";

export default class SellingItemDetailActionResource {
  constructor(data, findImage) {
    const matchingImages = findImage.filter(
      (image) => image.itemId.toString() === data._id.toString()
    );

    const image = matchingImages.map((image) => ({
      _id: image._id,
      url: baseUrl(image.image),
    }));

    (this._id = data._id),
      (this.categoryId = data.categoryId._id),
      (this.category = data.categoryId.name),
      (this.subCategoryId =
        data.subCategoryId && data.subCategoryId._id
          ? data.subCategoryId._id
          : null),
      (this.subCategory = data.subCategoryId ? data.subCategoryId.name : null),
      (this.subSubCategory = data.subSubCategoryId
        ? data.subSubCategoryId.name
        : null),
      (this.productName = data.productName),
      (this.brand = data.brand),
      (this.otherBrand = data.otherBrand),
      (this.model = data.model),
      (this.conditions = data.conditions),
      (this.price = this.formatPrice(data.price)),
      (this.newPrice = this.formatPrice(data.newPrice)),
      (this.image = image.length > 0 ? image[0].url : null);
  }

  formatPrice(price) {
    const formattedPrice = parseFloat(price).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formattedPrice;
  }
}
