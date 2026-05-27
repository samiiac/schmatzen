import mongoose from "mongoose";


const wishlistSchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

// prevents duplicate wishlist entries
wishlistSchema.index({ user: 1, service: 1 }, { unique: true });


const wishlistModel = mongoose.models.wishlists || mongoose.model('wishlist',wishlistSchema);

export default wishlistModel;