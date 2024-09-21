import mongoose from "mongoose";

const adminOtpsSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAdmin",
    },
    otp: {
      type: Number,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AdminOtps = mongoose.model("adminOtps", adminOtpsSchema);

export default AdminOtps;
