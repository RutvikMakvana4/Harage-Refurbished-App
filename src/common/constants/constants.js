/**
 * constant.js
 * @description :: constants
 */

module.exports = {
  JWT: {
    SECRET: process.env.SECRETKEY,
    EXPIRES_IN: "1 YEAR",
  },
  BCRYPT: {
    SALT_ROUND: 12,
  },
  ROLE: {
    CUSTOMER: 0,
    SUPERADMIN: 1,
  },
  BUYER: {
    COD: {
      ORDERPLACED: 1,
      PROCESSING: 2,
      OUTOFDELIVERY: 3,
      DELIVERED: 4,
    },
    SKIPCASH: {
      ORDERPLACED: 1,
      PAYMENTCONFIRM: 2,
      PROCESSING: 3,
      OUTOFDELIVERY: 4,
      DELIVERED: 5,
    },

    CANCELLED: 6,
    RETURNED: 7,
    REFUNDED: 8
  },

  SELLER: {
    SUBMITTED: 1,
    UNDERREVIEW: 2,
    PARCIALACCEPTANCE: 3,
    ORDERREJECTED: 4,
    COMPLETED: 5,
    CANCELLED: 6,
    PRICE_CHANGE: 7,
    REJECTION_REASON: 8,
  },

  SUPERADMIN: {
    BUYER: {
      ORDERPLACED: 1,
      PAYMENTCONFIRM: 2,
      CANCELLED: 3,
      EXCHANGEREQUEST: 4,
    },
    SELLER: {
      SUBMITTED: 5,
    },

    ACCEPT_PRICE_REQUEST: 6,
    REJECT_PRICE_REQUEST: 7,
  },

  TYPE: {
    SELLER: 0,
    BUYER: 1,
  },
};