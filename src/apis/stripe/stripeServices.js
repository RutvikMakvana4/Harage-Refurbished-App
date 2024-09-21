import Customer from "../../../model/stripeCustomer";
import Card from "../../../model/stripeCards";
import commonService from "../../../utils/commonService";
import Stripe from "stripe";
import mongoose from "mongoose";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import PaymentInvoice from "../../../model/paymentInvoice";
import BuyProduct from "../../../model/buyingProducts";
import { baseUrl } from "../../common/constants/configConstants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class stripeServices {
    /**
     * @description: Add from stripe
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async createCard(auth, data, req, res) {
        const { fullName, cardNumber, cvc, expMonth, expYear } = data;

        try {
            const customerFind = await commonService.findOne(Customer, { userId: auth })

            const cardToken = await stripe.tokens.create({
                card: {
                    name: fullName,
                    number: cardNumber,
                    cvc: cvc,
                    exp_month: expMonth,
                    exp_year: expYear,
                }
            })

            const cardCreate = await stripe.customers.createSource(customerFind.customerId, {
                source: cardToken.id
            })

            const storeCard = await commonService.createOne(Card, {
                userId: auth,
                customerId: customerFind.customerId,
                cardId: cardCreate.id,
                fullName: fullName,
                lastNumber: cardCreate.last4,
                expMonth: cardCreate.exp_month,
                expYear: cardCreate.exp_year,
                brand: cardCreate.brand,
                type: "2",
                cardName: cardCreate.brand,
                icon: baseUrl('img/cards/' + cardCreate.brand + '.png'),
            });

            return storeCard;

        } catch (err) {
            switch (err.type) {
                case "StripeCardError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeRateLimitError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeInvalidRequestError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeAPIError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeConnectionError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeAuthenticationError":
                    throw new BadRequestException(err.message);
                    break;
                default:
                    throw new BadRequestException(err.message);
                    break;
            }
        }
    }



    /**
     * @description: card lists
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async cardList(auth, data, req, res) {
        const paymentmethodList = await Card.find({ label: 0 })
        const cardList = await Card.find({ userId: auth })

        const mergedArray = paymentmethodList.concat(cardList);
        return mergedArray
    }



    /**
     * @description: Set default card
     * @param {*} auth  
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     */
    static async setDefaultCard(auth, id, req, res) {
        try {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const findCardId = await commonService.findById(Card, { _id: id });

                if (findCardId) {

                    await stripe.customers.update(findCardId.customerId, {
                        default_source: findCardId.cardId,
                    });

                    const customerCardRetrive = await stripe.customers.retrieve(findCardId.customerId);
                    const stripeCardIdFind = await commonService.findOne(Card, { cardId: customerCardRetrive.default_source });

                    await Card.updateMany({ userId: auth }, { isDefault: false });

                    const updateDefaultCard = await commonService.updateById(Card, stripeCardIdFind._id, {
                        isDefault: true
                    });

                } else {
                    throw new NotFoundException("This cardId is not found");
                }
            } else {
                throw new BadRequestException("Please provide correct id");
            }
        } catch (err) {
            switch (err.type) {
                case "StripeCardError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeRateLimitError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeInvalidRequestError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeAPIError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeConnectionError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeAuthenticationError":
                    throw new BadRequestException(err.message);
                    break;
                default:
                    throw new BadRequestException(err.message);
                    break;
            }
        }
    }


    /**
     * @description : Delete Card and their informations 
     * @param {*} auth 
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteCardInfo(auth, id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findCardId = await commonService.findById(Card, { _id: id });

            if (findCardId) {
                const deleteCard = await stripe.customers.deleteSource(findCardId.customerId, findCardId.cardId);
                await commonService.deleteById(Card, findCardId._id);
                return true;
            } else {
                throw new NotFoundException("This cardId is not found")
            }

        } else {
            throw new BadRequestException("Please provide correct id")
        }
    }

    /**
     * @description : Edit information of Card
     * @param {*} auth 
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async editCardInfo(auth, id, data, req, res) {
        const { fullName, cardNumber, cvc, expMonth, expYear } = data;

        try {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const findCardId = await commonService.findById(Card, { _id: id });

                if (findCardId) {
                    const cardToken = await stripe.tokens.create({
                        card: {
                            name: fullName,
                            number: cardNumber,
                            cvc: cvc,
                            exp_month: expMonth,
                            exp_year: expYear,
                        }
                    });

                    const cardCreate = await stripe.customers.createSource(findCardId.customerId, {
                        source: cardToken.id
                    })

                    const updateCard = await commonService.createOne(Card, {
                        userId: auth,
                        customerId: findCardId.customerId,
                        cardId: cardCreate.id,
                        fullName: cardCreate.name,
                        lastNumber: cardCreate.last4,
                        expMonth: cardCreate.exp_month,
                        expYear: cardCreate.exp_year,
                        brand: cardCreate.brand
                    });

                    if (updateCard) {
                        await stripe.customers.deleteSource(findCardId.customerId, findCardId.cardId);

                        await commonService.deleteById(Card, { _id: findCardId._id });
                        return updateCard;
                    }
                    else {
                        throw new BadRequestException('card not update')
                    }
                } else {
                    throw new NotFoundException('card not found')
                }
            }
            else {
                throw new BadRequestException("Please provide correct id")
            }
        } catch (err) {
            switch (err.type) {
                case "StripeCardError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeRateLimitError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeInvalidRequestError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeAPIError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeConnectionError":
                    throw new BadRequestException(err.message);
                    break;
                case "StripeAuthenticationError":
                    throw new BadRequestException(err.message);
                    break;
                default:
                    throw new BadRequestException(err.message);
                    break;
            }
        }
    }


    /**
     * @description : Create Payment Charge
     * @param {*} id
     * @param {*} auth
     * @param {*} req
     * @param {*} res
     */
    static async createCharge(id, auth, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findOrderId = await BuyProduct.findById(id)

            if (findOrderId) {
                const findCustomer = await Customer.findOne({ userId: auth });
                const totalPay = findOrderId.totalPrice

                const charge = await stripe.charges.create({
                    amount: totalPay,
                    currency: "usd",
                    customer: findCustomer.customerId,
                    description: "Product buy from Harage",
                });

                if (charge) {

                    // Store invoice for this Cart Products
                    await PaymentInvoice.create({
                        userId: auth,
                        orderId: findOrderId._id,
                        invoiceId: charge.id,
                        paymentMethod: 2
                    });

                    return true;

                } else {
                    throw new BadRequestException("Payment failed")
                }
            } else {
                throw new NotFoundException("This cart Id is not found")
            }
        } else {
            throw new BadRequestException("Please provide correct id")
        }
    } catch(err) {
        switch (err.type) {
            case "StripeCardError":
                throw new BadRequestException(err.message);
                break;
            case "StripeRateLimitError":
                throw new BadRequestException(err.message);
                break;
            case "StripeInvalidRequestError":
                throw new BadRequestException(err.message);
                break;
            case "StripeAPIError":
                throw new BadRequestException(err.message);
                break;
            case "StripeConnectionError":
                throw new BadRequestException(err.message);
                break;
            case "StripeAuthenticationError":
                throw new BadRequestException(err.message);
                break;
            default:
                throw new BadRequestException(err.message);
                break;
        }
    }
}

export default stripeServices;