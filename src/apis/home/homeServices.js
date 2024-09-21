import Users from "../../../model/users";
import Category from "../../../model/categories";
import Address from "../../../model/address";
import Cart from "../../../model/cart";
import Product from "../../../model/product";
import HomeResource from "./resources/homeResource";
import ProductCardDeatil from "./resources/detailsCardResource";
import ProductImages from "../../../model/productImages";
import Notification from "../../../model/notifications";

class homeServices {
  /**
   * @description : home page Details
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async homePage(auth, req, res) {
    try {
      let userData = {
        name: null,
        address: null,
        cart: null,
        notificationCount: 0,
      };

      if (req.isAuthenticated) {
        userData.name = await Users.findOne({ _id: auth });
        userData.address = await Address.findOne({
          userId: auth,
          isDefault: true,
        });
        userData.cart = await Cart.findOne({
          userId: auth,
          isBuying: false,
        }).populate("addToCart");
        userData.notificationCount = await Notification.find({
          userId: auth,
          readAt: false,
        }).count();
      }

      const categories = await Category.aggregate([
        { $limit: 5 },
        {
          $lookup: {
            from: "subcategories",
            localField: "_id",
            foreignField: "categoryId",
            as: "subCategories",
          },
        },
      ]);

      const productList = await Product.find({})
        .populate("categoryId")
        .populate("subCategoryId")
        .populate("subSubCategoryId");

      const randomProducts = await Product.aggregate([
        // { $match: { isPurchased: false } },
        { $sample: { size: productList.length } },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryId",
          },
        },
        {
          $unwind: {
            path: "$categoryId",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subCategoryId",
            foreignField: "_id",
            as: "subCategoryId",
          },
        },
        {
          $unwind: {
            path: "$subCategoryId",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "subsubcategories",
            localField: "subSubCategoryId",
            foreignField: "_id",
            as: "subSubCategoryId",
          },
        },
        {
          $unwind: {
            path: "$subSubCategoryId",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      // console.log(randomProducts);

      const productIds = randomProducts.map((product) => product._id);
      const findImage = await ProductImages.find({
        productId: { $in: productIds },
      });

      const homeData = {
        name: userData.name,
        address: userData.address,
        cart: userData.cart,
        notificationCount: userData.notificationCount,
        categories: categories,
      };

      const response = new HomeResource(homeData, randomProducts, findImage);
      return res.json({data : response});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @description : searching - home page
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async search(query, req, res) {
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;
    const search = query.search;

    const searchQuery = {
      $or: [
        { productName: { $regex: ".*" + search + ".*", $options: "i" } },
        { brand: { $regex: ".*" + search + ".*", $options: "i" } },
        { price: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    };

    const totalDocument = await Product.find(
      search ? searchQuery : { isPurchased: false }
    ).count();
    const findProduct = await Product.find(
      search ? searchQuery : { isPurchased: false }
    )
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("subSubCategoryId")
      .skip(page * pageLimit)
      .limit(pageLimit);

    const productIds = findProduct.map((product) => product._id);

    const findImage = await ProductImages.find({
      productId: { $in: productIds },
    });

    const meta = {
      total: totalDocument,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(totalDocument / pageLimit),
    };

    return { data: new ProductCardDeatil(findProduct, findImage), meta };
  }

  /**
   * @description : Product price under 1000 & under 99
   * @param {*} req
   * @param {*} res
   */
  static async priceListing(query, req, res) {
    try {
      const page = parseInt(query.page) - 1 || 0;
      const pageLimit = parseInt(query.limit) || 20;
      const { key } = query;

      if (key == "Under QAR 1000") {
        const priceUnder1000 = await Product.find({
          $and: [
            { isPurchased: false },
            {
              $expr: {
                $and: [
                  { $gte: [{ $toInt: "$price" }, 1] },
                  { $lte: [{ $toInt: "$price" }, 1000] },
                ],
              },
            },
          ],
        })
          .populate("categoryId")
          .populate("subCategoryId")
          .populate("subSubCategoryId");
        console.log(priceUnder1000.length);

        const totalDocument = await Product.find({
          $and: [
            { isPurchased: false },
            {
              $expr: {
                $and: [
                  { $gte: [{ $toInt: "$price" }, 1] },
                  { $lte: [{ $toInt: "$price" }, 1000] },
                ],
              },
            },
          ],
        }).count();

        const productIds = priceUnder1000.map((product) => product._id);
        const findImage = await ProductImages.find({
          productId: { $in: productIds },
        });

        const meta = {
          total: totalDocument,
          perPage: pageLimit,
          currentPage: page + 1,
          lastPage: Math.ceil(totalDocument / pageLimit),
        };

        return { data: new ProductCardDeatil(priceUnder1000, findImage), meta };
      } else if (key == "Under QAR 99") {
        const priceUnder99 = await Product.find({
          $and: [
            { isPurchased: false },
            {
              $expr: {
                $and: [
                  { $gte: [{ $toInt: "$price" }, 1] },
                  { $lte: [{ $toInt: "$price" }, 99] },
                ],
              },
            },
          ],
        })
          .populate("categoryId")
          .populate("subCategoryId")
          .populate("subSubCategoryId");

        const totalDocument = await Product.find({
          $and: [
            { isPurchased: false },
            {
              $expr: {
                $and: [
                  { $gte: [{ $toInt: "$price" }, 1] },
                  { $lte: [{ $toInt: "$price" }, 99] },
                ],
              },
            },
          ],
        }).count();

        const productIds = priceUnder99.map((product) => product._id);
        const findImage = await ProductImages.find({
          productId: { $in: productIds },
        });

        const meta = {
          total: totalDocument,
          perPage: pageLimit,
          currentPage: page + 1,
          lastPage: Math.ceil(totalDocument / pageLimit),
        };

        return { data: new ProductCardDeatil(priceUnder99, findImage), meta };
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default homeServices;

// const link = {
//     first : apiBaseUrl(`home-page/price-listing?${meta.currentPage}`),
//     last : apiBaseUrl(`home-page/price-listing?${meta.lastPage}`),
//     prev : page > 0 ? apiBaseUrl(`home-page/price-listing?page=${page}`) : null,
//     next : page < Math.ceil(totalDocument / pageLimit) - 1 ? apiBaseUrl(`home-page/price-listing?page=${page + 2}`) : null,
// }

// static async priceUnder1000(req, res) {
//     const priceUnder1000 = await Product.find({ price: { $gte: 1, $lte: 1000 } });

//     // Extract item IDs from the products found
//     const itemIds = priceUnder1000.map(product => product._id);

//     // Find associated images based on the extracted item IDs
//     const images = await ProductImages.find({ productId: { $in: itemIds } });

//     // Create a map to associate images with their respective products
//     const imageMap = new Map();
//     images.forEach(image => {
//         const productId = image.productId.toString();
//         if (!imageMap.has(productId)) {
//             imageMap.set(productId, []);
//         }
//         imageMap.get(productId).push(image);
//     });

//     // Create the final response with both product data and associated images
//     const response = priceUnder1000.map(product => {
//         const productId = product._id.toString();
//         const productImages = imageMap.has(productId) ? imageMap.get(productId) : [];
//         return {
//             _id: product._id,
//             title: product.title,
//             price: product.price,
//             images: productImages.map(image => baseUrl(image.image))
//         };
//     });

//     return new ProductPriceResource(response);
// }