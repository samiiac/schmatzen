import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
      },
    ],
  },
  { timestamps: true },
);

const wishlistModel =
  mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema);

export default wishlistModel;