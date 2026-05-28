import wishlistModel from "../models/Wishlist.js";
import userModel from "../models/User.js";
import serviceModel from "../models/Service.js";

/**
 * ADD TO WISHLIST
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceId } = req.body;

    const user = await userModel.findById(userId);
    const serviceExists = await serviceModel.findById(serviceId);

    if (!user || !serviceExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or service." });
    }

    const existing = await wishlistModel.findOne({
      user: userId,
      service: serviceId,
    });

    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Already in wishlist." });
    }

    const newWishlistItem = new wishlistModel({
      user: userId,
      service: serviceId,
    });

    await newWishlistItem.save();

    res.status(201).json({
      success: true,
      message: "Added to wishlist.",
      newWishlistItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET USER WISHLIST
 */
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await wishlistModel
      .find({ user: userId })
      .populate("service");

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * REMOVE SINGLE ITEM
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const deleted = await wishlistModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found." });
    }
    res.status(200).json({ success: true, message: "Removed from wishlist." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CLEAR ALL WISHLIST ITEMS
 */
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await wishlistModel.deleteMany({ user: userId });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
