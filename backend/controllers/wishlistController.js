import wishlistModel from "../models/Wishlist.js";
import mongoose from "mongoose";

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await wishlistModel.findOne({ userId }).populate("services");
    
    if (!wishlist) {
      return res.status(200).json({ success: true, services: [] });
    }
    
    res.status(200).json({ success: true, services: wishlist.services });
  } catch (error) {
    console.log("Error getting wishlist", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceId } = req.body;

    let wishlist = await wishlistModel.findOne({ userId });
    
    if (!wishlist) {
      wishlist = new wishlistModel({ userId, services: [serviceId] });
    } else {
      if (!wishlist.services.includes(serviceId)) {
        wishlist.services.push(serviceId);
      }
    }
    
    await wishlist.save();
    res.status(200).json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    console.log("Error adding to wishlist", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await wishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { services: id } },
      { new: true }
    );
    
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.log("Error removing from wishlist", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };