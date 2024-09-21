import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    superAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellItems",
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: Number,
      default: null,
    },
    notificationType: {
      type: Number,
      trim: true,
    },
    price: {
      type: Number,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    isBuySell: {
      type: String, // 0 => Buyer | 1 => Seller
      default: null,
    },
    readAt: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
