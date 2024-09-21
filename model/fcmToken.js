import mongoose from "mongoose";

const fcmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    token: {
      type: String,
      trim: true,
    },
    deviceId: {
      type: String,
      trim: true,
    },
    deviceType: {
      type: String,
      trim: true,
    },
    userType: {
      type: Number, //  1 - Customer ||  2 - Super Admin
      default: 1,
    },
  },
  { timestamps: true }
);

const FcmStore = mongoose.model("fcmtoken", fcmSchema);

export default FcmStore;
