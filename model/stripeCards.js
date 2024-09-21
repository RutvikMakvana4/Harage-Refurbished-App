import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    cardName: {
      type: String,
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    label: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Card = mongoose.model("stripecard", cardSchema);

export default Card;
