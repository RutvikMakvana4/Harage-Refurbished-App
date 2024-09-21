import mongoose from "mongoose";

const buyerOrderStatusSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuyOrder",
    },
    status: {
      type: Number,
      default: 0,
    },
    deliveryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const BuyerOrderStatus = mongoose.model(
  "BuyerOrderStatus",
  buyerOrderStatusSchema
);

export default BuyerOrderStatus;
