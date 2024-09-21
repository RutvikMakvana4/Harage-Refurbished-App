import mongoose from "mongoose";
import {
  BadRequestException,
  NotFoundException,
} from "../../common/exceptions/errorException";
import SellItems from "../../../model/sellingItems";
import SellingOrderResource from "./resources/sellingOrderResources";
import SellingOrderDetailsResource from "./resources/sellingOrderDetailResources";
import ItemImages from "../../../model/itemImages";
import Item from "../../../model/item";
import Category from "../../../model/categories";
import SubCategory from "../../../model/subCategories";
import SubSubCategory from "../../../model/subSubCategories";
import path from "path";
import fs from "fs";
import pdf from "html-pdf";
import ejs from "ejs";
import { randomNumberGenerator, isValidObjectId } from "../../common/helper";
import { baseUrl } from "../../common/constants/configConstants";
import BuyOrder from "../../../model/buyOrder";
import Cart from "../../../model/cart";
import BuyOneProduct from "../../../model/buyOneProduct";
import ProductImages from "../../../model/productImages";
import BuyingOrderDetailsResource from "./resources/buyingOrderDetailResources";
import SellingItemDetailActionResource from "./resources/sellingItemDetailActionResource";

class historyServices {
  /**
   * @description : order history
   * @param {*} auth
   * @param {*} id
   * @param {*} data
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async orderHistory(query, auth, req, res) {
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;
    const { type } = query;

    if (type === "0") {
      console.log("0");
      const historyDetails = await SellItems.find({
        userId: auth,
        isSelling: true,
      }).sort({ orderDate: -1 });

      const totalDocument = await SellItems.find({
        userId: auth,
        isSelling: true,
      }).count();

      const meta = {
        total: totalDocument,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(totalDocument / pageLimit),
      };

      const orderResource = new SellingOrderResource(historyDetails);

      return { data: orderResource.items, meta };
    } else if (type === "1") {
      console.log("1");
      const historyDetails = await BuyOrder.find({
        userId: auth,
        isBuying: true,
      })
        .populate("paymentMethod")
        .sort({ orderDate: -1 });

      const totalDocument = await BuyOrder.find({
        userId: auth,
        isBuying: true,
      }).count();

      const meta = {
        total: totalDocument,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(totalDocument / pageLimit),
      };

      const orderResource = new SellingOrderResource(historyDetails);

      return { data: orderResource.items, meta };
    }
  }

  /**
   * @description : order history in details
   * @param {*} auth
   * @param {*} id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async orderHistoryDetails(id, query, auth, req, res) {
    const { type } = query;

    isValidObjectId(id);

    try {
      if (type === "0") {
        const historyDetails = await SellItems.findById({
          _id: id,
          userId: auth,
          isSelling: true,
        })
          .populate("userId")
          .populate("sellingItems.itemId")
          .populate("pickUpAddress");

        if (!historyDetails) {
          throw new BadRequestException("Order id not found");
        }

        const itemsData = historyDetails.sellingItems;

        const itemDetails = await Promise.all(
          itemsData.map(async (value) => {
            const category = await Category.findOne({
              _id: value.itemId.categoryId,
            });
            const subCategory = await SubCategory.findOne({
              _id: value.itemId.subCategoryId,
            });
            const subSubCategory = await SubSubCategory.findOne({
              _id: value.itemId.subSubCategoryId,
            });

            if (category || subCategory) {
              return {
                ...value.itemId._doc,
                categoryId: value.itemId.categoryId,
                category: category,
                subCategoryId: value.itemId.subCategoryId
                  ? value.itemId.subCategoryId
                  : null,
                subCategory: subCategory ? subCategory : null,
                subSubCategory: subSubCategory,
                status: value.status,
                rejectionReason: value.itemId.rejectionReason
                  ? value.itemId.rejectionReason
                  : null,
                isConfirmRequest: value.itemId.isConfirmRequest
                  ? value.itemId.isConfirmRequest
                  : null,
              };
            }
          })
        );

        const itemIds = itemsData.map((item) => item.itemId._id);
        const findImage = await ItemImages.find({ itemId: { $in: itemIds } });

        const detailsHistory = await SellItems.findById({
          _id: id,
          userId: auth,
          isSelling: true,
        })
          .populate("userId")
          .populate("sellingItems")
          .populate("pickUpAddress")
          .populate("assignMember");

        return {
          ...new SellingOrderDetailsResource(
            detailsHistory,
            itemDetails,
            findImage
          ),
        };
      } else if (type === "1") {
        const findOrder = await BuyOrder.findById({
          _id: id,
          userId: auth,
          isBuying: true,
        });

        if (!findOrder) {
          throw new BadRequestException("Order id not found");
        }

        if (findOrder.actionType === "0") {
          console.log("0");

          const buyNowOrder = await BuyOrder.findById(findOrder._id)
            .populate("buyProductId")
            .populate("shippingAddress")
            .populate("paymentMethod");

          const product = buyNowOrder.buyProductId;
          const findBuyOneProduct = await BuyOneProduct.findOne(
            product._id
          ).populate("buyOneProduct");

          const orderProducts = findBuyOneProduct.buyOneProduct;

          const orderProductsArray = Array.isArray(orderProducts)
            ? orderProducts
            : [orderProducts];

          var allProducts = await Promise.all(
            orderProductsArray.map(async (value) => {
              const category = await Category.findOne({
                _id: value.categoryId,
              });
              const subCategory = await SubCategory.findOne({
                _id: value.subCategoryId,
              });

              if (category || subCategory) {
                return {
                  ...value._doc,
                  category,
                  subCategory: subCategory || null,
                };
              }
            })
          );

          const productIds = orderProductsArray.map((product) => product._id);
          const findImage = await ProductImages.find({
            productId: { $in: productIds },
          });

          const detailsHistory = await BuyOrder.findById({
            _id: id,
            userId: auth,
            isBuying: true,
          })
            .populate("userId")
            .populate("buyProductId")
            .populate("shippingAddress")
            .populate("paymentMethod")
            .populate("assignMember");

          return {
            ...new BuyingOrderDetailsResource(
              detailsHistory,
              allProducts,
              findImage
            ),
          };
        } else {
          console.log("1");
          const cartOrder = await BuyOrder.findById(findOrder._id)
            .populate("cartId")
            .populate("shippingAddress");

          const cart = cartOrder.cartId;
          const findCart = await Cart.findOne(cart._id).populate("addToCart");

          const products = findCart.addToCart;

          const productDetails = await Promise.all(
            products.map(async (value) => {
              const category = await Category.findOne({
                _id: value.categoryId,
              });
              const subCategory = await SubCategory.findOne({
                _id: value.subCategoryId,
              });
              const subSubCategory = await SubSubCategory.findOne({
                _id: value.subSubCategoryId,
              });

              if (category || subCategory) {
                return {
                  ...value._doc,
                  categoryId: value.categoryId,
                  category: category,
                  subCategoryId: value.subCategoryId
                    ? value.subCategoryId
                    : null,
                  subCategory: subCategory ? subCategory : null,
                  subSubCategory: subSubCategory,
                };
              }
            })
          );

          const productIds = products.map((product) => product._id);
          const findImage = await ProductImages.find({
            productId: { $in: productIds },
          });

          const detailsHistory = await BuyOrder.findById({
            _id: id,
            userId: auth,
            isBuying: true,
          })
            .populate("userId")
            .populate("cartId")
            .populate("shippingAddress")
            .populate("paymentMethod")
            .populate("assignMember");

          return {
            ...new BuyingOrderDetailsResource(
              detailsHistory,
              productDetails,
              findImage
            ),
          };
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }

  /**
   * @description: Selling Order item detail action
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async itemDetailAction(id, req, res) {
    const findOrderItem = await Item.findOne({ _id: id })
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("subSubCategoryId");

    if (!findOrderItem) {
      throw new NotFoundException("Item not found");
    }

    const findImage = await ItemImages.find({ itemId: { $in: id } });

    return {
      ...new SellingItemDetailActionResource(findOrderItem, findImage),
    };
  }

  /**
   * @description : selling item delete in order history
   * @param {*} auth
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async sellingItemDelete(id, auth, req, res) {
    // try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const findSellingItems = await SellItems.findOne({
        userId: auth,
        isSelling: true,
        sellingItems: id,
      });

      let removeItem = await SellItems.findByIdAndUpdate(
        findSellingItems._id,
        { $pull: { sellingItems: id } },
        { new: true }
      );

      if (removeItem.sellingItems.length === 0) {
        const deleteOrder = await SellItems.findByIdAndDelete({
          _id: removeItem._id,
        });
      }

      const findItem = await Item.findById({ _id: id });

      if (findItem) {
        const deleteImage = await ItemImages.deleteMany({
          itemId: findItem._id,
        });
        const deleteItem = await Item.findByIdAndDelete(findItem.id);
      } else {
        throw new NotFoundException("item not found");
      }
    } else {
      throw new BadRequestException("Please provide correct item id");
    }
    // } catch (error) {
    //     console.log(error, "err1")
    // }
  }

  /**
   * @description : Download invoice for orders
   * @param {*} id
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async invoiceDownload(id, query, auth, req, res) {
    const { type } = query;

    isValidObjectId(id);

    try {
      if (type === "0") {
        const findOrder = await SellItems.findOne({
          _id: id,
          userId: auth,
          isSelling: true,
        })
          .populate("userId")
          .populate("sellingItems")
          .populate("pickUpAddress");

        const buyItems = findOrder.sellingItems.map((item) => {
          return {
            productName: item.productName,
            price: item.price,
          };
        });

        let pickUpAddress = null;

        if (findOrder.pickUpAddress && findOrder.pickUpAddress.type) {
          if (findOrder.pickUpAddress.type === "0") {
            pickUpAddress = `${findOrder.pickUpAddress.floor} ${findOrder.pickUpAddress.buildingName} ${findOrder.pickUpAddress.company} ${findOrder.pickUpAddress.street}`;
          } else if (findOrder.pickUpAddress.type === "1") {
            pickUpAddress = `${findOrder.pickUpAddress.houseNumber} ${findOrder.pickUpAddress.street}`;
          } else if (findOrder.pickUpAddress.type === "2") {
            pickUpAddress = `${findOrder.pickUpAddress.floor} ${findOrder.pickUpAddress.apartmentNo} ${findOrder.pickUpAddress.buildingName} ${findOrder.pickUpAddress.street}`;
          }
        }

        var data = {
          fullName: findOrder.userId.fullName,
          email: findOrder.userId.email,
          countryCode: findOrder.userId.countryCode,
          phone: findOrder.userId.phone,
          buyItems: buyItems,
          totalOrder: findOrder.totalOrder,
          totalPrice: findOrder.totalPrice,
          orderDate: findOrder.orderDate,
          orderId: findOrder.orderId,
          address: pickUpAddress,
        };
      } else {
        const findOrder = await BuyOrder.findOne({
          _id: id,
          userId: auth,
          isBuying: true,
        })
          .populate("userId")
          .populate("shippingAddress");

        let purchasedProducts;

        if (findOrder.actionType === "1") {
          const findCart = await Cart.findById(findOrder.cartId).populate(
            "addToCart"
          );

          purchasedProducts = findCart.addToCart.map((product) => {
            return {
              productName: product.productName,
              price: product.price,
            };
          });
        } else {
          const findOneProduct = await BuyOneProduct.findById(
            findOrder.buyProductId
          ).populate("buyOneProduct");

          const orderProducts = findOneProduct.buyOneProduct;

          const orderProductsArray = Array.isArray(orderProducts)
            ? orderProducts
            : [orderProducts];
          purchasedProducts = orderProductsArray.map((product) => {
            return {
              productName: product.productName,
              price: product.price,
            };
          });
        }

        let shippingAddress = null;

        if (findOrder.shippingAddress && findOrder.shippingAddress.type) {
          if (findOrder.shippingAddress.type === "0") {
            shippingAddress = `${findOrder.shippingAddress.floor} ${findOrder.shippingAddress.buildingName} ${findOrder.shippingAddress.company} ${findOrder.shippingAddress.street}`;
          } else if (findOrder.shippingAddress.type === "1") {
            shippingAddress = `${findOrder.shippingAddress.houseNumber} ${findOrder.shippingAddress.street}`;
          } else if (findOrder.shippingAddress.type === "2") {
            shippingAddress = `${findOrder.shippingAddress.floor} ${findOrder.shippingAddress.apartmentNo} ${findOrder.shippingAddress.buildingName} ${findOrder.shippingAddress.street}`;
          }
        }

        var data = {
          fullName: findOrder.userId.fullName,
          email: findOrder.userId.email,
          countryCode: findOrder.userId.countryCode,
          phone: findOrder.userId.phone,
          buyItems: purchasedProducts,
          totalOrder: findOrder.totalOrder,
          totalPrice: findOrder.totalAmount,
          orderDate: findOrder.orderDate,
          orderId: findOrder.orderId,
          address: shippingAddress,
        };
      }

      const appLogoPath = path.join(__dirname, "../../../public/img/logo.png");
      const imageBuffer = fs.readFileSync(appLogoPath);
      const imageData = imageBuffer.toString("base64");

      await ejs
        .renderFile(
          path.join(__dirname, "../../../views/invoice/generator.ejs"),
          { data: data, logo: imageData }
        )
        .then((data) => {
          const filename = randomNumberGenerator(4) + "_invoice" + ".pdf";

          let options = {
            format: "A4",
            type: "pdf",
          };

          pdf
            .create(data, options)
            .toFile(
              path.join(__dirname, `../../../public/invoices/${filename}`),
              (err, data) => {
                if (err) {
                  throw new BadRequestException(err.message);
                }

                return res.send({
                  data: {
                    url: baseUrl(`invoices/${filename}`),
                  },
                });
              }
            );
        });
    } catch (err) {
      console.log(err, "Error_Catch");
    }
  }
}

export default historyServices;