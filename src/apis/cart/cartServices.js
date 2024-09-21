import mongoose from "mongoose";
import Cart from "../../../model/cart";
import CartItemsResource from "./resources/cartItemsResource";
import { BadRequestException, InternalServerError, NotFoundException } from "../../common/exceptions/errorException";
import Address from '../../../model/address';
import ProductImages from "../../../model/productImages";
import Card from "../../../model/stripeCards";
import BuyOneProduct from "../../../model/buyOneProduct";
import BuyOrder from "../../../model/buyOrder";
import Category from "../../../model/categories";
import SubCategory from "../../../model/subCategories";
import SubSubCategory from "../../../model/subSubCategories";
import Product from "../../../model/product";
import Customer from "../../../model/stripeCustomer";
import Stripe from "stripe";
import moment from "moment";
import OrderStatus from "../../../model/orderStatus";
import OrderProductsResource from "./resources/orderProductsResource";
import CheckOutResource from "./resources/checkoutResource";

import crypto from "crypto";
import Users from "../../../model/users";
import axios from "axios";
import PaymentInvoice from "../../../model/paymentInvoice";
import { baseUrl } from "../../common/constants/configConstants";
import BuyingOrderDetailsResource from "../orderHistory/resources/buyingOrderDetailResources";
import PaymentSuccessOrderResource from "./resources/paymentSuccessOrder";
import { sendPushNotificationBuyOrder, sendPushNotificationSuperAdmin } from "../../common/helper";
import SuperAdmin from "../../../model/superAdmin";
import { SUPERADMIN, TYPE } from "../../common/constants/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SkipCashSecret = process.env.SKIPCASH_KEY_SECRET;
const SkipCashKeyId = process.env.SKIPCASH_KEY_ID;
const SkipCashClientId = process.env.SKIPCASH_CLIENT_ID;
const SkipCashPaymentUrl = process.env.SKIPCASH_PAYMENT_URL;

class cartServices {

    /**
     * @description: Add to Cart
     * @param {*} id 
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     */
    static async addToCart(id, auth, req, res) {
        // try {
        if (mongoose.Types.ObjectId.isValid(id)) {

            const findCart = await Cart.findOne({ userId: auth, isBuying: false })

            if (!findCart) {
                const craeteNewCart = await Cart.create({
                    userId: auth,
                    addToCart: [id],
                })

            } else {
                const alreadyAdded = findCart.addToCart.find((ids) => ids.toString() === id);

                if (alreadyAdded) {
                    throw new BadRequestException("This product is already added in the cart")
                } else {
                    await Cart.findByIdAndUpdate(findCart._id, { $push: { addToCart: id } }, { new: true })
                }
            }

            const updatedCart = await Cart.findOne({ userId: auth, isBuying: false }).populate('addToCart');

            const cartItems = updatedCart.addToCart.length;
            return cartItems
        } else {
            throw new BadRequestException("Please provide correct id");
        }
        // } catch (err) {
        //     console.log(err, "p")
        // }
    }


    /**
     * @description: Get Cart Products
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     */
    static async getCartProducts(auth, req, res) {
        // try {
        const findCart = await Cart.findOne({ userId: auth, isBuying: false }).populate('addToCart');
        if (!findCart) {
            const cartProductsResource = new CartItemsResource([], []);
            return { data: cartProductsResource.products, totalAmount: '0' };
        }

        const cartProducts = findCart.addToCart;

        const allProducts = await Promise.all(cartProducts.map(async (value) => {
            const category = await Category.findOne({ _id: value.categoryId })
            const subCategory = await SubCategory.findOne({ _id: value.subCategoryId })

            if (category || subCategory) {
                return {
                    ...value._doc,
                    category: category,
                    subCategory: subCategory ? subCategory : null,
                }
            }
        }))

        const productIds = cartProducts.map(product => product._id);
        const findImage = await ProductImages.find({ productId: { $in: productIds } })

        let totalMRP = 0;
        for (let i = 0; i < allProducts.length; i++) {
            totalMRP = totalMRP + parseInt(allProducts[i].price);
        }

        const totalAmount = totalMRP.toLocaleString();
        const totalOrder = allProducts.length;

        await Cart.findByIdAndUpdate(findCart._id, { totalAmount: totalAmount, totalOrder: totalOrder })

        const cartProductsResource = new CartItemsResource(allProducts, findImage);
        return { data: cartProductsResource.products, totalAmount };

        // } catch (err) {
        //     console.log(err, "err")
        // }
    }

    /**
     * @description: Remove products in cart
     * @param {*} id
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     */
    static async removeProduct(id, auth, req, res) {
        try {

            if (mongoose.Types.ObjectId.isValid(id)) {
                const findCart = await Cart.findOne({ userId: auth, isBuying: false });

                const alreadyAdded = findCart.addToCart.find((ids) => ids.toString() === id);

                if (alreadyAdded) {
                    await Cart.findByIdAndUpdate(findCart._id, { $pull: { addToCart: id } }, { new: true })
                }

                const updatedCart = await Cart.findOne({ userId: auth, isBuying: false }).populate('addToCart');

                const cartItems = updatedCart.addToCart.length;
                return cartItems
            } else {
                throw new BadRequestException("Please provide correct product id");
            }
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * @description : Buy Now 
     * @param {*} id
     * @param {*} auth
     * @param {*} req
     * @param {*} res
     */
    static async buyNow(id, auth, req, res) {
        try {
            if (mongoose.Types.ObjectId.isValid(id)) {

                const findBuyProduct = await BuyOneProduct.findOne({ userId: auth })

                if (!findBuyProduct) {
                    const findProduct = await Product.findOne({ _id: id })

                    await BuyOneProduct.create({
                        userId: auth,
                        buyOneProduct: id,
                        totalAmount: findProduct.price,
                        totalOrder: 1
                    });

                } else {

                    const findProduct = await Product.findOne({ _id: id })
                    await BuyOneProduct.updateOne(
                        { _id: findBuyProduct._id },
                        {
                            buyOneProduct: id,
                            totalAmount: findProduct.price,
                            isBuying: false
                        },
                    );
                }
            }
        } catch (err) {
            console.log(err, "Err_Catch")
        }
    }


    /**
     * @description : checkout 
     * @param {*} query
     * @param {*} auth
     * @param {*} req
     * @param {*} res
     */
    static async checkout(query, auth, req, res) {
        const { type } = query;

        if (type === "0") {
            console.log("0")

            var findBuyProduct = await BuyOneProduct.findOne({ userId: auth, isBuying: false }).populate('buyOneProduct');

            const orderProducts = findBuyProduct.buyOneProduct;

            const orderProductsArray = Array.isArray(orderProducts) ? orderProducts : [orderProducts];

            var allProducts = await Promise.all(orderProductsArray.map(async (value) => {
                const category = await Category.findOne({ _id: value.categoryId });
                const subCategory = await SubCategory.findOne({ _id: value.subCategoryId });

                if (category || subCategory) {
                    return {
                        ...value._doc,
                        category,
                        subCategory: subCategory || null,
                    };
                }
            }));

            const productIds = orderProductsArray.map(product => product._id);
            var findImage = await ProductImages.find({ productId: { $in: productIds } });

            const findAddress = await Address.findOne({ userId: auth, isDefault: true })
            const findPaymentMethod = await Card.findOne({ isDefault: true })

            return { ... new CheckOutResource(findBuyProduct._id, findAddress, findPaymentMethod, findBuyProduct.totalAmount, allProducts, findImage) }

        } else if (type === "1") {
            console.log("1")

            const findCart = await Cart.findOne({ userId: auth, isBuying: false }).populate('addToCart');
            if (!findCart) {
                const cartProductsResource = new CartItemsResource([], []);
                return { data: cartProductsResource.products, totalAmount: '0' };
            }

            const cartProducts = findCart.addToCart;

            const allProducts = await Promise.all(cartProducts.map(async (value) => {
                const category = await Category.findOne({ _id: value.categoryId })
                const subCategory = await SubCategory.findOne({ _id: value.subCategoryId })

                if (category || subCategory) {
                    return {
                        ...value._doc,
                        category: category,
                        subCategory: subCategory ? subCategory : null,
                    }
                }
            }))

            const productIds = cartProducts.map(product => product._id);
            const findImage = await ProductImages.find({ productId: { $in: productIds } })

            const findAddress = await Address.findOne({ userId: auth, isDefault: true })
            const findPaymentMethod = await Card.findOne({ isDefault: true })

            return { ... new CheckOutResource(findCart._id, findAddress, findPaymentMethod, findCart.totalAmount, allProducts, findImage) }

        }
    }

    /**
     * @description : Payment for user orders
     * @param {*} id 
     * @param {*} query 
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async payNow(id, query, auth, req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new BadRequestException("Please provide correct order id");
            }

            const findCart = await Cart.findOne({ _id: id, userId: auth, isBuying: false }).populate('addToCart');

            if (findCart) {
                const orderProducts = findCart.addToCart;

                var allProducts = await Promise.all(orderProducts.map(async (value) => {
                    const category = await Category.findOne({ _id: value.categoryId });
                    const subCategory = await SubCategory.findOne({ _id: value.subCategoryId });

                    if (category || subCategory) {
                        return {
                            ...value._doc,
                            category,
                            subCategory: subCategory || null,
                        };
                    }
                }));

                const productIds = orderProducts.map(product => product._id);
                var findImage = await ProductImages.find({ productId: { $in: productIds } });

                const countTotalOrder = await BuyOrder.find({ isBuying: true }).count();

                var createOrder = await BuyOrder.create({
                    userId: auth,
                    orderId: countTotalOrder + 1,
                    orderDate: new Date(),
                    cartId: findCart._id,
                    actionType: 1,
                    shippingAddress: query.addressId,
                    paymentMethod: query.paymentMethodId,
                    totalAmount: findCart.totalAmount,
                    totalOrder: findCart.totalOrder
                });

            } else {
                var findBuyProduct = await BuyOneProduct.findOne({ _id: id, userId: auth, isBuying: false }).populate('buyOneProduct');

                const orderProducts = findBuyProduct.buyOneProduct;

                const orderProductsArray = Array.isArray(orderProducts) ? orderProducts : [orderProducts];

                var allProducts = await Promise.all(orderProductsArray.map(async (value) => {
                    const category = await Category.findOne({ _id: value.categoryId });
                    const subCategory = await SubCategory.findOne({ _id: value.subCategoryId });

                    if (category || subCategory) {
                        return {
                            ...value._doc,
                            category,
                            subCategory: subCategory || null,
                        };
                    }
                }));



                const productIds = orderProductsArray.map(product => product._id);
                var findImage = await ProductImages.find({ productId: { $in: productIds } });

                const countTotalOrder = await BuyOrder.find({ isBuying: true }).count();

                var createOrder = await BuyOrder.create({
                    userId: auth,
                    orderId: countTotalOrder + 1,
                    orderDate: new Date(),
                    buyProductId: findBuyProduct._id,
                    actionType: 0,
                    shippingAddress: query.addressId,
                    paymentMethod: query.paymentMethodId,
                    totalAmount: findBuyProduct.totalAmount,
                    totalOrder: findBuyProduct.totalOrder
                });

            }

            if (query.type === "1") {
                console.log("1 - cash on delivery")

                await BuyOrder.findByIdAndUpdate(createOrder._id, {
                    isBuying: true
                });

                if (findCart) {
                    await Cart.findByIdAndUpdate(findCart._id, {
                        isBuying: true
                    })

                    findCart.addToCart.map(async (product) => {
                        await Product.findByIdAndUpdate({ _id: product._id }, { isPurchased: true }, { new: true })
                    })

                } else {
                    // await BuyOneProduct.findByIdAndUpdate(findBuyProduct._id, {
                    //     isBuying: true
                    // })
                }

                // Payment invoice store
                await PaymentInvoice.create({
                    userId: auth,
                    orderId: createOrder._id,
                    paymentMethod: 1
                });

                // const shippingAddress = await Address.findOne({ _id: query.addressId });
                // const cartProductsResource = new CartItemsResource(allProducts, findImage);

                // const data = { orderDetails, shippingAddress }
                const data = {
                    _id: createOrder._id,
                    payment: 1,
                    link: null
                }

                return res.send({ message: "Your order has been successfully placed.", data })

            } else if (query.type === "2") {
                console.log("2 - Skip Cash")

                // Skip Cash
                const UUID = require('uuid').v4()

                function buildData(request) {
                    const list = [];
                    appendData(list, "Uid", request.Uid);
                    appendData(list, "KeyId", request.KeyId.toString());
                    appendData(list, "Amount", request.Amount);
                    appendData(list, "FirstName", request.FirstName);
                    appendData(list, "LastName", request.LastName);
                    appendData(list, "Email", request.Email);
                    appendData(list, "Custom1", request.custom1);

                    return list.join(',');
                }

                function appendData(list, name, value) {
                    if (value !== null && value !== undefined && value !== '') {
                        list.push(`${name}=${value}`);
                    }
                }

                const findUser = await Users.findById(auth);

                // Request object
                const request = {
                    Uid: UUID,
                    KeyId: SkipCashKeyId,
                    Amount: createOrder.totalAmount,
                    FirstName: findUser.fullName,
                    LastName: findUser.fullName,
                    Email: findUser.email,
                    custom1: createOrder._id
                };

                function calculateSignature(request, secretKey) {
                    const data = buildData(request);
                    const hmac = crypto.createHmac('sha256', secretKey);
                    hmac.update(data);
                    return hmac.digest('base64');
                }

                // console.log("UUID", UUID);
                // console.log("Authorization", calculateSignature(request, SkipCashSecret));

                try {
                    const response = await axios({
                        url: SkipCashPaymentUrl,
                        method: "post",
                        data: request,
                        headers: {
                            'Authorization': calculateSignature(request, SkipCashSecret),
                            'Content-Type': 'application/json'
                        }
                    });

                    // console.log(response.data);

                    // Payment invoice store
                    await PaymentInvoice.create({
                        userId: auth,
                        orderId: createOrder._id,
                        paymentId: response.data.resultObj.id,
                        paymentResponse: JSON.stringify(response.data.resultObj),
                        paymentLink: response.data.resultObj.payUrl,
                        paymentMethod: 2
                    });

                    await BuyOrder.findByIdAndUpdate(createOrder._id, {
                        status: 2
                    }, { new: true });

                    const data = {
                        _id: createOrder._id,
                        payment: 2,
                        link: response.data.resultObj.payUrl
                    }

                    return res.send({ data: data })

                } catch (err) {
                    console.log(err);
                }

                // return res.send({ message: "Your order has been successfully placed.", data })

                // const findOrder = await BuyOrder.findById(createOrder._id);

                // if (findOrder) {
                //     const findCustomer = await Customer.findOne({ userId: auth });
                //     const totalAmount = findOrder.totalAmount

                //     var totalPay = parseInt(totalAmount.replace(/,/g, ''), 10);

                //     const charge = await stripe.charges.create({
                //         amount: totalPay,
                //         currency: "usd",
                //         customer: findCustomer.customerId,
                //         description: "Product buy from Harage"
                //     });

                //     if (charge) {
                //         await BuyOrder.findByIdAndUpdate(createOrder._id, {
                //             isBuying: true,
                //             isPaymentCompleted: true
                //         });

                //         if (findCart) {
                //             await Cart.findByIdAndUpdate(findCart._id, {
                //                 isBuying: true
                //             })
                //         } else {
                //             await BuyOneProduct.findByIdAndUpdate(findBuyProduct._id, {
                //                 isBuying: true
                //             })
                //         }
                //     } else {
                //         throw new BadRequestException("Payment failed")
                //     }
                // }
            }

        } catch (err) {
            console.log(err);
        }
    }



    /**
     * Payment success
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async skipcashPaymentSuccess(req, res) {
        const { custom1 } = req.query

        return res.redirect(`${process.env.DEEPLINK_SKIPCASH}?id=${custom1}`)
    }



    /**
     * Purchase order details
     * @param {*} auth 
     * @param {*} orderId 
     * @param {*} req 
     * @param {*} res
     */
    static async purchaseOrderDeteils(auth, orderId, req, res) {
      try {
          var message;
          const findOrderId = await BuyOrder.findById(orderId).populate('buyProductId').populate('cartId');
  
          if (!findOrderId) {
              throw new BadRequestException("OrderId not found");
          }
  
          const shippingAddress = await Address.findOne({ _id: findOrderId.shippingAddress });
  
          const findInvoice = await PaymentInvoice.findOne({ userId: auth, orderId: orderId });
  
          if (!findInvoice) {
              throw new BadRequestException("Invoice not found");
          }
  
          const findBuyProduct = await BuyOneProduct.findOne({ _id: findOrderId.buyProductId, userId: auth, isBuying: false }).populate('buyOneProduct');
          const findCart = await Cart.findOne({ _id: findOrderId.cartId, userId: auth, isBuying: false }).populate('addToCart');
  
          const superAdmin = await SuperAdmin.findOne();
  
          if (findInvoice.paymentMethod === '1') {
              console.log("Cash on delivery");
              message = "Your order has been successfully placed."
  
              if (findBuyProduct) {
                  await BuyOneProduct.findByIdAndUpdate(findBuyProduct._id, {
                      isBuying: true
                  });
  
                  await Product.findByIdAndUpdate(
                      { _id: findOrderId.buyProductId.buyOneProduct },
                      { isPurchased: true },
                      { new: true }
                  );
              }
  
              await sendPushNotificationBuyOrder(1, orderId, findOrderId.userId, findOrderId.orderId, findInvoice.paymentMethod);
  
              // Super Admin
              //   await sendPushNotificationSuperAdmin(1, orderId, superAdmin._id, findOrderId.orderId, findInvoice.paymentMethod);
              
              const adminNotificationData = {
                status: SUPERADMIN.BUYER.ORDERPLACED.toString(),
                notificationType: SUPERADMIN.BUYER.ORDERPLACED.toString(),
                orderId: findOrderId._id.toString(),
                auth: superAdmin._id.toString(),
                orderNumber: findOrderId.orderId.toString(),
                orderType: TYPE.BUYER.toString(),
              };
              sendPushNotificationSuperAdmin(adminNotificationData);
  
          } else if (findInvoice.paymentMethod === '2') {
              // try {
              const response = await axios({
                  url: SkipCashPaymentUrl + "/" + findInvoice.paymentId,
                  method: "get",
                  headers: {
                      'Authorization': SkipCashClientId,
                      'Content-Type': 'application/json'
                  }
              });
  
              // console.log(response.data);
  
  
              if (response.data.resultObj.statusId === 2) {
                  message = "Your order has been successfully placed."
  
                  await BuyOrder.findByIdAndUpdate(findOrderId._id, {
                      isBuying: true,
                      isPaymentCompleted: true
                  });
  
                  if (findCart) {
                      await Cart.findByIdAndUpdate(findCart._id, {
                          isBuying: true
                      })
                  } else {
                      await BuyOneProduct.findByIdAndUpdate(findBuyProduct._id, {
                          isBuying: true
                      })
                  }
  
                  await sendPushNotificationBuyOrder(3, orderId, findOrderId.userId, findOrderId.orderId, findInvoice.paymentMethod);
                  await sendPushNotificationBuyOrder(1, orderId, findOrderId.userId, findOrderId.orderId, findInvoice.paymentMethod);
  
                  // Super admin
                  //   await sendPushNotificationSuperAdmin(1, orderId, superAdmin._id, findOrderId.orderId);
                  const adminNotificationData = {
                    status: SUPERADMIN.BUYER.ORDERPLACED.toString(),
                    notificationType: SUPERADMIN.BUYER.ORDERPLACED.toString(),
                    orderId: findOrderId._id.toString(),
                    auth: superAdmin._id.toString(),
                    orderNumber: findOrderId.orderId.toString(),
                    orderType: TYPE.BUYER.toString(),
                  };
                  sendPushNotificationSuperAdmin(adminNotificationData);
  
              } else if (response.data.resultObj.statusId === 1) {
                  message = "Payment is pending"
              } else if (response.data.resultObj.statusId === 3) {
                  message = "Payment is canceled"
              } else if (response.data.resultObj.statusId === 4) {
                  message = "Payment is failed"
              } else if (response.data.resultObj.statusId === 5) {
                  message = "Payment is rejected"
              } else if (response.data.resultObj.statusId === 6) {
                  message = "Payment is refunded"
              } else if (response.data.resultObj.statusId === 7) {
                  message = "Payment is pending refund"
              } else if (response.data.resultObj.statusId === 8) {
                  message = "Payment is refund failed"
              } else {
                  message = "Payment is pending"
              }
  
              // } catch (err) {
              //     throw new InternalServerError("Internal server error");
              // }
          }
  
          if (findOrderId.actionType === "0") {
              console.log("0")
  
              const buyNowOrder = await BuyOrder.findById(findOrderId._id).populate('buyProductId').populate('shippingAddress').populate('paymentMethod');
  
              const product = buyNowOrder.buyProductId
              const findBuyOneProduct = await BuyOneProduct.findOne(product._id).populate('buyOneProduct')
  
              const orderProducts = findBuyOneProduct.buyOneProduct
  
              const orderProductsArray = Array.isArray(orderProducts) ? orderProducts : [orderProducts];
  
              var allProducts = await Promise.all(orderProductsArray.map(async (value) => {
                  const category = await Category.findOne({ _id: value.categoryId });
                  const subCategory = await SubCategory.findOne({ _id: value.subCategoryId });
  
                  if (category || subCategory) {
                      return {
                          ...value._doc,
                          category,
                          subCategory: subCategory || null,
                      };
                  }
              }));
  
              const productIds = orderProductsArray.map(product => product._id);
              const findImage = await ProductImages.find({ productId: { $in: productIds } })
  
              const detailsHistory = await BuyOrder.findById({ _id: orderId, userId: auth, isBuying: true }).populate('userId').populate('buyProductId').populate('shippingAddress').populate('paymentMethod').populate('assignMember');
  
              return { message: message, data: new PaymentSuccessOrderResource(detailsHistory, allProducts, findImage) };
  
          } else {
              console.log("cart 1")
              const cartOrder = await BuyOrder.findById(findOrderId._id).populate('cartId').populate('shippingAddress');
  
              const cart = cartOrder.cartId
              const findCart = await Cart.findOne(cart._id).populate('addToCart')
  
              const products = findCart.addToCart
  
              const productDetails = await Promise.all(products.map(async (value) => {
                  const category = await Category.findOne({ _id: value.categoryId })
                  const subCategory = await SubCategory.findOne({ _id: value.subCategoryId })
                  const subSubCategory = await SubSubCategory.findOne({ _id: value.subSubCategoryId })
  
                  if (category || subCategory) {
                      return {
                          ...value._doc,
                          categoryId: value.categoryId,
                          category: category,
                          subCategoryId: value.subCategoryId ? value.subCategoryId : null,
                          subCategory: subCategory ? subCategory : null,
                          subSubCategory: subSubCategory
                      }
                  }
              }))
  
              const productIds = products.map(product => product._id);
              const findImage = await ProductImages.find({ productId: { $in: productIds } })
  
              const detailsHistory = await BuyOrder.findById({ _id: orderId, userId: auth, isBuying: true }).populate('userId').populate('cartId').populate('shippingAddress').populate('paymentMethod').populate('assignMember');
  
              return { message: message, data: new PaymentSuccessOrderResource(detailsHistory, productDetails, findImage) };
          }
      } catch (error) {
        console.log(error, "error");
      }
    }



    /**
     * @description: Order all products list
     * @param {*} id 
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async orderProducts(id, auth, req, res) {
        const findOrder = await BuyOrder.findById({ _id: id, userId: auth, isBuying: true })

        if (findOrder.actionType === "0") {
            console.log("0")

            const buyNowOrder = await BuyOrder.findById(findOrder._id).populate('buyProductId').populate('shippingAddress').populate('paymentMethod');

            const product = buyNowOrder.buyProductId
            const findBuyOneProduct = await BuyOneProduct.findOne(product._id).populate('buyOneProduct')

            const orderProducts = findBuyOneProduct.buyOneProduct

            const orderProductsArray = Array.isArray(orderProducts) ? orderProducts : [orderProducts];

            var orderDetails = await Promise.all(orderProductsArray.map(async (value) => {
                const category = await Category.findOne({ _id: value.categoryId });
                const subCategory = await SubCategory.findOne({ _id: value.subCategoryId });

                if (category || subCategory) {
                    return {
                        ...value._doc,
                        category,
                        subCategory: subCategory || null,
                    };
                }
            }));

            const productIds = orderProductsArray.map(product => product._id);
            var findImage = await ProductImages.find({ productId: { $in: productIds } })

        } else {
            console.log("1")
            const cartOrder = await BuyOrder.findById(findOrder._id).populate('cartId').populate('shippingAddress')

            const cart = cartOrder.cartId
            const findCart = await Cart.findOne(cart._id).populate('addToCart')

            var products = findCart.addToCart

            var orderDetails = await Promise.all(products.map(async (value) => {
                const category = await Category.findOne({ _id: value.categoryId })
                const subCategory = await SubCategory.findOne({ _id: value.subCategoryId })
                const subSubCategory = await SubSubCategory.findOne({ _id: value.subSubCategoryId })

                if (category || subCategory) {
                    return {
                        ...value._doc,
                        categoryId: value.categoryId,
                        category: category,
                        subCategoryId: value.subCategoryId ? value.subCategoryId : null,
                        subCategory: subCategory ? subCategory : null,
                        subSubCategory: subSubCategory
                    }
                }
            }))

            const productIds = products.map(product => product._id);
            var findImage = await ProductImages.find({ productId: { $in: productIds } })
        }

        return { ...new OrderProductsResource(orderDetails, findImage) };
    }

    /**
     * @description : Track order
     * @param {*} query
     * @param {*} auth  
     * @param {*} req 
     * @param {*} res 
     */
    static async trackOrder(query, auth, req, res) {
        const orderId = query.orderId;
        const paymentType = parseInt(query.paymentType);

        const findOrder = await BuyOrder.findById(orderId)

        if (!findOrder) {
            throw new BadRequestException("OrderId not found");
        }

        let orderStatusList = await OrderStatus.find(
            { paymentType: paymentType },
            { "status": 1, "statusCode": 1 }
        ).sort({ statusCode: 1 })

        if (paymentType === 1) {
            orderStatusList;
        } else if (paymentType === 2) {
            orderStatusList;
        } else {
            throw new NotFoundException("Please enter correct paymentType")
        }

        const orderDetails = {
            orderId: findOrder.orderId,
            orderDate: moment(findOrder.orderDate).unix(),
            status: findOrder.status
        }

        const data = { orderDetails, orderStatusList }
        return data
    }

    /**
     * @description : Cancel Order
     * @param {*} id
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     */
    static async cancelOrder(id, auth, req, res) {
        const findOrder = await BuyOrder.findOne({ _id: id, userId: auth, isBuying: true })

        if (findOrder) {
            const orderCreationTime = moment(findOrder.createdAt);
            const currentTime = moment();
            const timeDifference = currentTime.diff(orderCreationTime, 'hours');

            if (timeDifference <= 2) {

                if (findOrder.actionType == 0) {
                    const buyNowOrder = await BuyOrder.findById(findOrder._id).populate("buyProductId");

                    const product = buyNowOrder.buyProductId;
                    const findBuyOneProduct = await BuyOneProduct.findOne(product._id).populate("buyOneProduct");
                    const cancelOrderProduct = findBuyOneProduct.buyOneProduct;

                    await Product.findByIdAndUpdate(cancelOrderProduct._id, {
                        isPurchased: false
                    }, { new: true });

                    await BuyOrder.findByIdAndUpdate(findOrder._id, {
                        status: 6
                    });

                    await sendPushNotificationBuyOrder(6, findOrder._id, findOrder.userId, findOrder.orderId, 0);
                    return true;

                } else {
                    const cartOrder = await BuyOrder.findById(findOrder._id).populate("cartId");

                    const cart = cartOrder.cartId;
                    const findCart = await Cart.findOne(cart._id).populate("addToCart");
                    const cancelOrderProducts = findCart.addToCart;

                    cancelOrderProducts.map(async (product) => {
                        await Product.findByIdAndUpdate(product._id, {
                            isPurchased: false
                        }, { new: true });
                    })

                    await BuyOrder.findByIdAndUpdate(findOrder._id, {
                        status: 6
                    }, { new: true });
    
                    await sendPushNotificationBuyOrder(6, findOrder._id, findOrder.userId, findOrder.orderId, 0);
                    return true;    
                }

            } else {
                throw new BadRequestException('Cannot cancel the order after two hours');
            }

        } else {
            throw new NotFoundException("Order not found");
        }
    }



    /**
     * Refund
     * @param {*} orderId 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async skipcashRefundAmount(orderId, req, res) {
        const orderDetails = await BuyOrder.findById(orderId);
        if (!orderDetails) {
            throw new NotFoundException("Order not found");
        }

        const invoice = await PaymentInvoice.findOne({ orderId: orderDetails._id, paymentMethod: "2", refundSuccess: false });

        if (!invoice) {
            throw new BadRequestException("Refund already initiated.");
        }

        function buildData(request) {
            const list = [];
            appendData(list, "Id", request.Id);
            appendData(list, "KeyId", request.KeyId);
            return list.join(',');
        }

        function appendData(list, name, value) {
            if (value !== null && value !== undefined && value !== '') {
                list.push(`${name}=${value}`);
            }
        }

        const request = {
            Id: invoice.paymentId,
            KeyId: SkipCashKeyId,
            Amount: orderDetails.totalAmount,
        }

        function calculateSignature(request, secretKey) {
            const data = buildData(request);
            const hmac = crypto.createHmac('sha256', secretKey);
            hmac.update(data);
            return hmac.digest('base64');
        }

        try {
            // Get Payment details
            // const getPayment = await axios({
            //     url: SkipCashPaymentUrl + "/" + invoice.paymentId,
            //     method: "get",
            //     headers: {
            //         'Authorization': SkipCashClientId,
            //         'Content-Type': 'application/json'
            //     }
            // });

            // console.log(getPayment.data);

            // Refund 
            const response = await axios({
                url: SkipCashPaymentUrl + "/" + "refund",
                method: "post",
                data: request,
                headers: {
                    'Authorization': calculateSignature(request, SkipCashSecret),
                    'Content-Type': 'application/json'
                }
            });

            await BuyOrder.findByIdAndUpdate(orderId, {
                status: 8
            }, { new: true });

            await PaymentInvoice.findByIdAndUpdate(invoice._id, {
                refundSuccess: true,
                refundAmount: orderDetails.totalAmount,
                refundId: response.data.resultObj.refundId
            }, { new: true });


            return res.send({ message: "Refund transfer successfully" });
        } catch (err) {
            return res.send({ message: "Internal server error" });
        }
    }
}
export default cartServices;