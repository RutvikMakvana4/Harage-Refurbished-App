import commonService from "../../../utils/commonService";
import OneItemResource from "./resources/OneItemResources";
import Item from "../../../model/item";
import mongoose from "mongoose";
import ItemImages from "../../../model/itemImages";
import {
  BadRequestException,
  NotFoundException,
} from "../../common/exceptions/errorException";
import ItemListResource from "./resources/listItemsResources";
import {
  changeSellingOrderStatus,
  randomNumberGenerator,
  sendPushNotificationSellingOrder,
  sendPushNotificationSuperAdmin,
  setSellingOrderTotalPrice,
} from "../../common/helper";
import SellItems from "../../../model/sellingItems";
import Address from "../../../model/address";
import fs from "fs";
import path from "path";
import SubCategory from "../../../model/subCategories";
import Category from "../../../model/categories";
import SubSubCategory from "../../../model/subSubCategories";
import { createUserLog } from "../../common/helper";
import SuperAdmin from "../../../model/superAdmin";
import { SELLER, SUPERADMIN, TYPE } from "../../common/constants/constants";

class itemServices {
  /**
   * @description: Quick sell add items
   * @param {*} data
   * @param {*} auth
   * @param {*} files
   * @param {*} req
   * @param {*} res
   */
  static async addItems(data, auth, files, req, res) {
    try {
      const orderId = randomNumberGenerator(5);
      const imagePaths = files.map((file) => `itemImages/${file.filename}`);

      for (const key in data) {
        data[key] = data[key] ? data[key] : null;
      }

      if (!Array.isArray(data.additionalFeatures)) {
        data.additionalFeatures = data.additionalFeatures
          ? data.additionalFeatures.split(/,(?![^()]*\))/)
          : null;
      }
      if (!Array.isArray(data.features)) {
        data.features = data.features
          ? data.features.split(/,(?![^()]*\))/)
          : null;
      }
      if (!Array.isArray(data.connectivityFeatures)) {
        data.connectivityFeatures = data.connectivityFeatures
          ? data.connectivityFeatures.split(/,(?![^()]*\))/)
          : null;
      }
      if (!Array.isArray(data.smartTvFeatures)) {
        data.smartTvFeatures = data.smartTvFeatures
          ? data.smartTvFeatures.split(/,(?![^()]*\))/)
          : null;
      }

      const categoryId = await Category.findById(data.categoryId);
      if (!categoryId) {
        throw new BadRequestException("Please enter correct category Id");
      }

      // const subCategoryId = await SubCategory.findById(data.subCategoryId)
      // if (!subCategoryId) {
      //     throw new BadRequestException('Please enter correct subCategory Id');
      // }

      // const subSubCategoryId = await SubSubCategory.findById(data.subSubCategoryId)
      // if (!subSubCategoryId) {
      //     throw new BadRequestException('Please enter correct subSubCategory Id');
      // }

      const addItems = await commonService.createOne(Item, {
        userId: auth,
        ...data,
      });

      const sellingItem = await SellItems.findOne({
        userId: auth,
        isSelling: false,
      });

      if (!sellingItem) {
        const newItems = await SellItems.create({
          orderId: orderId,
          userId: auth,
          sellingItems: [
            {
              itemId: addItems._id,
              status: 1,
            },
          ],
        });
      } else {
        const alreadyAdded = sellingItem.sellingItems.find(
          (ids) => ids.toString() === addItems._id
        );
        if (alreadyAdded) {
          let removeItem = await SellItems.findByIdAndUpdate(
            sellingItem._id,
            {
              $pull: {
                sellingItems: [
                  {
                    itemId: addItems._id,
                    status: 1,
                  },
                ],
              },
            },
            { new: true }
          );
        } else {
          let addItem = await SellItems.findByIdAndUpdate(
            sellingItem._id,
            {
              $push: {
                sellingItems: [
                  {
                    itemId: addItems._id,
                    status: 1,
                  },
                ],
              },
            },
            { new: true }
          );
        }
      }

      for (let img of imagePaths) {
        const storeImages = await ItemImages.create({
          subCategoryId: addItems.subCategoryId,
          subSubCategoryId: addItems.subSubCategoryId,
          itemId: addItems._id,
          image: img,
        });
      }

      const findImage = await ItemImages.find({ itemId: addItems._id });

      return { ...new OneItemResource(addItems, findImage) };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: get all quick sell items
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async addItemList(auth, req, res) {
    try {
      const sellingItem = await SellItems.findOne({
        userId: auth,
        isSelling: false,
      }).populate("sellingItems.itemId");

      if (!sellingItem) {
        throw new NotFoundException(
          "You have not added items, please add items"
        );
      }

      const Items = sellingItem.sellingItems;

      const items = await Promise.all(
        Items.map(async (value) => {
          const category = await Category.findById(value.itemId.categoryId);
          const subCategory = await SubCategory.findById(
            value.itemId.subCategoryId
          );
          const subSubCategory = await SubSubCategory.findById(
            value.itemId.subSubCategoryId
          );

          // Return the item with additional category, subCategory and subSubCategory details
          return {
            ...value.itemId._doc,
            categoryId: value.itemId.categoryId,
            category: category || null,
            subCategoryId: value.itemId.subCategoryId || null,
            subCategory: subCategory || null,
            subSubCategory: subSubCategory || null,
          };
        })
      );

      const itemIds = Items.map((product) => product.itemId._id);
      const findImage = await ItemImages.find({ itemId: { $in: itemIds } });

      const totalDocument = items.length;

      let priceMRP = 0;
      for (let i = 0; i < items.length; i++) {
        priceMRP += parseInt(items[i].price, 10);
      }

      const totalAmount = priceMRP
      const MRP = totalAmount;

      await SellItems.findByIdAndUpdate(
        sellingItem._id,
        { totalOrder: totalDocument, totalPrice: totalAmount },
        { new: true }
      );

      const itemListResource = new ItemListResource(items, findImage);

      return { data: itemListResource.items, MRP, totalAmount };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description : get one item details
   * @param {*} data
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async getItemDetails(id, req, res) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const findItem = await Item.findById({ _id: id });

      const findImage = await ItemImages.find({ itemId: id });

      if (!findItem) {
        throw new NotFoundException("This item not found");
      }

      return { data: new OneItemResource(findItem, findImage) };
    } else {
      throw new BadRequestException("Please provide correct item id");
    }
  }

  /**
   * @description: Edit Items
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async editItem(id, data, files, req, res) {
    console.log(data);
    const imagePaths = files.map((file) => `itemImages/${file.filename}`);

    if (mongoose.Types.ObjectId.isValid(id)) {
      const findItem = await Item.findOne({ _id: id });

      const findImage = await ItemImages.find({ itemId: findItem._id });

      if (!findItem) {
        throw new NotFoundException("Item not found");
      } else {
        for (const key in data) {
          data[key] = data[key] ? data[key] : null;
        }

        if (!Array.isArray(data.additionalFeatures)) {
          data.additionalFeatures = data.additionalFeatures
            ? data.additionalFeatures.split(/,(?![^()]*\))/)
            : null;
        }

        if (!Array.isArray(data.features)) {
          data.features = data.features
            ? data.features.split(/,(?![^()]*\))/)
            : null;
        }

        if (!Array.isArray(data.connectivityFeatures)) {
          data.connectivityFeatures = data.connectivityFeatures
            ? data.connectivityFeatures.split(/,(?![^()]*\))/)
            : null;
        }

        if (!Array.isArray(data.smartTvFeatures)) {
          data.smartTvFeatures = data.smartTvFeatures
            ? data.smartTvFeatures.split(/,(?![^()]*\))/)
            : null;
        }

        const updateItem = await Item.findByIdAndUpdate(
          findItem.id,
          {
            ...data,
          },
          { new: true }
        );

        for (let img of imagePaths) {
          const storeImages = await ItemImages.create({
            subCategoryId: findItem.subCategoryId,
            subSubCategoryId: findItem.subSubCategoryId,
            itemId: findItem._id,
            image: img,
          });
        }

        // return { ...new OneItemResource(updateItem) };
      }
    } else {
      throw new BadRequestException("Please provide correct item id");
    }
  }

  /**
   * @description : delete Item Images
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async deleteItemImage(ids, req, res) {
    if (!Array.isArray(ids)) {
      ids = ids ? ids.split(",") : [];
    }

    await Promise.all(
      ids.map(async (id) => {
        const findImage = await ItemImages.findOne({ _id: id });

        if (findImage) {
          // unLinkFile(findImage.image)
          // await fs.unlinkSync(path.join(__dirname, '../../../', findImage.image));
          return await ItemImages.findByIdAndDelete(id);
        } else {
          throw new NotFoundException("Image not found");
        }
      })
    );
  }

  /**
   * @description: Delete quick sell items
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async deleteItem(id, auth, req, res) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const findSelling = await SellItems.findOne({
          userId: auth,
          isSelling: false,
        });

        let removeItem = await SellItems.findByIdAndUpdate(
          findSelling._id,
          {
            $pull: {
              sellingItems: { itemId: id },
            },
          },
          { new: true }
        );

        const findItem = await Item.findOne({ _id: id });

        if (findItem) {
          const deleteImage = await ItemImages.deleteMany({
            itemId: findItem._id,
          });
          const deleteItem = await Item.findByIdAndDelete(findItem.id);

          //refresh quick sell list
          const sellingItem = await SellItems.findOne({
            userId: auth,
            isSelling: false,
          }).populate("sellingItems.itemId");

          const Items = sellingItem.sellingItems;

          const items = await Promise.all(
            Items.map(async (value) => {
              const category = await Category.findOne({
                _id: value.itemId.categoryId,
              });
              const subCategory = await SubCategory.findOne({
                _id: value.itemId.subCategoryId,
              });
              if (category || subCategory) {
                return {
                  ...value.itemId._doc,
                  category: category,
                  subCategory: subCategory,
                };
              }
            })
          );

          const itemIds = Items.map((product) => product.itemId._id);
          const findImage = await ItemImages.find({ itemId: { $in: itemIds } });

          const totalDocument = items.length;

          let MRP = 0;
          for (let i = 0; i < items.length; i++) {
            MRP = MRP + parseInt(items[i].price);
          }

          const totalAmount = MRP;

          await SellItems.findByIdAndUpdate(sellingItem._id, {
            totalOrder: totalDocument,
            totalPrice: totalAmount,
          });

          const itemListResource = new ItemListResource(items, findImage);

          return { data: itemListResource.items, MRP, totalAmount };
        } else {
          throw new NotFoundException("item not found");
        }
      } else {
        throw new BadRequestException("Please provide correct item id");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description : send notification for quick sell items
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async sendNow(id, auth, query, req, res) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const mediumOfCommunication = query.mediumOfCommunication;
        const languageOfCommunication = query.languageOfCommunication;

        const findAddress = await Address.findById({ _id: id, userId: auth });

        if (findAddress) {
          const findOrder = await SellItems.findOne({
            userId: auth,
            isSelling: false,
          });
          const countTotalOrder = await SellItems.find({
            isSelling: true,
          }).count();

          const updatedOrder = await SellItems.findByIdAndUpdate(
            findOrder._id,
            {
              pickUpAddress: findAddress._id,
              isSelling: true,
              orderDate: new Date(),
              orderId: countTotalOrder + 1,
              mediumOfCommunication: mediumOfCommunication,
              languageOfCommunication: languageOfCommunication,
            },
            { new: true }
          );

          createUserLog(
            auth,
            req.ip,
            "Order Created",
            "User sent their selling order through Quicksell"
          );

          const notificationData = {
            status: SELLER.SUBMITTED.toString(),
            notificationType: SELLER.SUBMITTED.toString(),
            orderId: updatedOrder._id.toString(),
            auth: updatedOrder.userId.toString(),
            orderNumber: updatedOrder.orderId.toString(),
          };

          sendPushNotificationSellingOrder(notificationData);

          // Super admin notification
          const superAdmin = await SuperAdmin.findOne();
          const adminNotificationData = {
            status: SUPERADMIN.SELLER.SUBMITTED.toString(),
            notificationType: SUPERADMIN.SELLER.SUBMITTED.toString(),
            orderId: updatedOrder._id.toString(),
            auth: superAdmin._id.toString(),
            orderNumber: updatedOrder.orderId.toString(),
            orderType: TYPE.SELLER.toString(),
            orderStatus: updatedOrder.status.toString(),
          };
          sendPushNotificationSuperAdmin(adminNotificationData);
        } else {
          throw new NotFoundException("This address id is not found");
        }
      } else {
        throw new BadRequestException("Please provide correct id");
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description : Accept/Reject Price Request
   * @param {*} auth
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async acceptRejectPrice(auth, query, req, res) {
    const type = parseInt(query.type);
    const orderId = query.orderId;
    const items = req.body.items;

    const findOrder = await SellItems.findOne({ _id: orderId, userId: auth });
    if (!findOrder) {
      throw new NotFoundException("Order not found");
    }

    const findOrderItems = findOrder.sellingItems;

    items.map((item) => {
      const itemExists = findOrderItems.some(
        (i) => i.itemId.toString() === item.itemId
      );

      if (!itemExists) {
        throw new NotFoundException("Item not found in the order");
      }
    });

    if (type === 1) {
      console.log("1");

      items.map(async (item) => {
        const findItem = await Item.findOne({ _id: item.itemId });

        await SellItems.findOneAndUpdate(
          { _id: findOrder._id, "sellingItems.itemId": item.itemId },
          { $set: { "sellingItems.$.status": 3 } },
          { new: true }
        );

        const updateOrderStatus = await changeSellingOrderStatus(orderId);

        const totalPrice = parseFloat(findOrder.totalPrice) || 0;
        console.log(totalPrice, "totalPrice");

        const oldPrice = parseFloat(findItem.price);
        console.log(oldPrice, "oldPrice");

        const newPrice = parseFloat(item.price) || 0;
        console.log(newPrice, "newPrice");

        const finalPrice = totalPrice - oldPrice + newPrice;
        console.log(finalPrice, "finalPrice");

        const updatedOrder = await SellItems.findOneAndUpdate(
          { _id: orderId },
          {
            status: updateOrderStatus,
            totalPrice: finalPrice,
          }
        );

        await Item.findByIdAndUpdate(
          item.itemId,
          {
            isConfirmRequest: true,
            price: item.price,
          },
          { new: true }
        );

        // Super admin notification
        const superAdmin = await SuperAdmin.findOne();
        const adminNotificationData = {
          status: SUPERADMIN.ACCEPT_PRICE_REQUEST.toString(),
          notificationType: SUPERADMIN.ACCEPT_PRICE_REQUEST.toString(),
          orderId: findOrder._id.toString(),
          itemId: item.itemId.toString(),
          auth: superAdmin._id.toString(),
          orderNumber: findOrder.orderId.toString(),
          orderType: TYPE.SELLER.toString(),
          orderStatus: updatedOrder.status.toString(),
        };
        sendPushNotificationSuperAdmin(adminNotificationData);
      });

      return res.status(200).json({
        message: "Price request accepted Successfully",
      });
    } else {
      console.log("2 - reject price");

      items.map(async (item) => {
        await Item.findByIdAndUpdate(
          item.itemId,
          {
            isConfirmRequest: true,
          },
          { new: true }
        );

        await SellItems.findOneAndUpdate(
          { _id: findOrder._id, "sellingItems.itemId": item.itemId },
          { $set: { "sellingItems.$.status": 4 } },
          { new: true }
        );

        const totalPrice = parseFloat(findOrder.totalPrice) || 0;
        const removePrice = parseFloat(item.price);
        const updatedTotalPrice = totalPrice - removePrice;

        const updateOrderStatus = await changeSellingOrderStatus(orderId);

        const updatedOrder = await SellItems.findOneAndUpdate(
          { _id: orderId },
          {
            status: updateOrderStatus,
            totalPrice: updatedTotalPrice,
            totalOrder: Number(findOrder.totalOrder) - 1,
          }
        );

        // Super admin notification
        const superAdmin = await SuperAdmin.findOne();
        const adminNotificationData = {
          status: SUPERADMIN.REJECT_PRICE_REQUEST.toString(),
          notificationType: SUPERADMIN.REJECT_PRICE_REQUEST.toString(),
          orderId: findOrder._id.toString(),
          itemId: item.itemId.toString(),
          auth: superAdmin._id.toString(),
          orderNumber: findOrder.orderId.toString(),
          orderType: TYPE.SELLER.toString(),
          orderStatus: updatedOrder.status.toString(),
        };
        sendPushNotificationSuperAdmin(adminNotificationData);
      });

      return res.status(200).json({
        message: "Price request rejected Successfully",
      });
    }
  }
}

export default itemServices;
