import { baseUrl } from "../../../common/constants/configConstants";

export default class HomeResource {
    constructor(homeData, productData, findImage) {
      
    this.fullName =
      homeData.name && homeData.name.fullName ? homeData.name.fullName : null;

    let address = null;
    if (
      homeData.address &&
      homeData.address.type &&
      homeData.address.isDefault
    ) {
      switch (homeData.address.type) {
        case "0":
          address = `${homeData.address.floor} ${homeData.address.buildingName} ${homeData.address.company} ${homeData.address.street}`;
          break;
        case "1":
          address = `${homeData.address.houseNumber} ${homeData.address.street}`;
          break;
        case "2":
          address = `${homeData.address.floor} ${homeData.address.apartmentNo} ${homeData.address.buildingName} ${homeData.address.street}`;
          break;
      }
    }
    this.address = address;

    this.cartItems =
      homeData.cart && homeData.cart.addToCart
        ? homeData.cart.addToCart.length
        : 0;
    this.notification = homeData.notificationCount || 0;
    this.categories = homeData.categories
      ? homeData.categories.map((data) => ({
          _id: data._id,
          name: data.name,
          image: data.image,
          formData: JSON.parse(data.formData || null),
          buyerData: JSON.parse(data.buyerData || null),
          subCategory: data.subCategories
            ? data.subCategories.map((subCategory) => ({
                _id: subCategory._id,
                name: subCategory.name,
              }))
            : [],
        }))
      : [];

    this.products = productData
      ? productData.map((product) => {
          const matchingImages = findImage.find(
            (image) => image.productId.toString() === product._id.toString()
          );

          return {
            _id: product._id,
            category:
              product.categoryId && product.categoryId.name
                ? product.categoryId.name
                : null,
            categoryId: product.categoryId ? product.categoryId._id : null,
            subCategory:
              product.subCategoryId && product.subCategoryId.name
                ? product.subCategoryId.name
                : null,
            subCategoryId: product.subCategoryId
              ? product.subCategoryId._id
              : null,
            subSubCategory:
              product.subSubCategoryId && product.subSubCategoryId.name
                ? product.subSubCategoryId.name
                : null,
            subSubCategoryId: product.subSubCategoryId
              ? product.subSubCategoryId._id
              : null,
            productName: product.productName,
            price: product.price,
            description: product.description,
            image: matchingImages ? baseUrl(matchingImages.image) : null,
          };
        })
      : [];
  }
}
