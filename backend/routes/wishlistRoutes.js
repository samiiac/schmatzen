import { Router } from "express";
import { z } from "zod";
import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { validateId, validatePayload } from "../middleware/validation.js";
import { authenticate, authorizeOwnerShip } from "../middleware/auth.js";
import wishlistModel from "../models/Wishlist.js";

const router = Router();

const wishlistSchema = z.object({
  service: z.string(),
});

router.get("/", authenticate, getUserWishlist);

router.post(
  "/",
  authenticate,
  validatePayload(wishlistSchema),
  addToWishlist,
);


router.delete(
  "/:id",
  authenticate,
  validateId,
  authorizeOwnerShip(wishlistModel),
  removeFromWishlist,
);


router.delete(
  "/",
  authenticate,
  clearWishlist,
  
);

export default router;