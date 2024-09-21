import mongoose from "mongoose";

const orderStatusSchema = new mongoose.Schema(
  {
    paymentType: {
      type: Number,
    },
    status: {
      type: String,
      default: null,
    },
    statusCode: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);

export default OrderStatus;