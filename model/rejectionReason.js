import mongoose from "mongoose";

const rejectionReasonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellItems",
      default: null,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const RejectionReason = mongoose.model(
  "RejectionReason",
  rejectionReasonSchema
);

export default RejectionReason;
