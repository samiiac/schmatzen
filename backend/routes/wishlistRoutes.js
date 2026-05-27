import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = Router();

router.get("/", authenticate, getWishlist);
router.post("/", authenticate, addToWishlist);
router.delete("/:id", authenticate, removeFromWishlist);

export default router;

