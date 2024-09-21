import mongoose from "mongoose";

const sellingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    orderId: {
      type: String,
      trim: true,
      default: null,
    },
    orderDate: {
      type: Date,
      trim: true,
      default: null,
    },
    sellingItems: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          default: null,
        },
        status: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalOrder: {
      type: String,
      trim: true,
      default: null,
    },
    totalPrice: {
      type: String,
      trim: true,
      default: null,
    },
    pickupScheduled: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: Number,
      default: 1,
    },
    pickUpAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      default: null,
    },
    isSelling: {
      type: Boolean,
      default: false,
    },
    assignMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAdmin",
      default: null,
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
    mediumOfCommunication: {
      type: Array,
      default: null,
    },
    languageOfCommunication: {
      type: Array,
      default: null,
    },
  },
  { timestamps: true }
);

const SellItems = mongoose.model("SellItems", sellingSchema);

export default SellItems;
