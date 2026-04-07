import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["Basic", "Premium"],
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ["Digital", "Digital and Physical"],
      required: true,
    },
    scheduledFor: {
      type: Date,
      required: true,
    },
    reservationStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shootLocation: {
      type: String,
      required: true,
    },
    shippingAddress: {
      street: String,
      city: String,
      country: String,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

const reservationModel =
  mongoose.models.reservations ||
  mongoose.model("reservation", reservationSchema);

export default reservationModel;
