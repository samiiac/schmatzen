import { Router } from "express";
import { z } from "zod";
import {
  addUserReservations,
  getUserReservations,
  updateUserReservations,
  updateReservations,
  getAllReservations,
} from "../controllers/reservationController.js";
import { validateId, validatePayload } from "../middleware/validation.js";
import {
  authenticate,
  authorize,
  authorizeOwnerShip,
} from "../middleware/auth.js";
import reservationModel from "../models/Reservation.js";

const router = Router();

const reservationBaseSchema = z.object({
  service: z.string(),
  serviceType: z.enum(["Basic", "Premium"]),
  scheduledFor: z.coerce.date(),
  shootLocation: z.string().min(5),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
});

const reservationSchema = reservationBaseSchema.refine(
  (data) => {
    if (data.serviceType == "Premium" && !data.shippingAddress) return false;
    return true;
  },
  {
    message: "Shipping Address is required.",
    path: ["shippingAddress"],
  },
);

const updatedReservationAdminSchema = z.object({
  reservationStatus: z
    .enum(["pending", "confirmed", "completed", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
});

const updatedReservationBaseSchema = z.object({
  serviceType: z.enum(["Basic", "Premium"]).optional(),
  scheduledFor: z.coerce.date().optional(),
  shootLocation: z.string().min(5).optional(),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
});

const updatedReservationSchema = updatedReservationBaseSchema.refine(
  (data) => {
    if (data.serviceType == "Premium" && !data.shippingAddress) return false;
    return true;
  },
  {
    message: "Shipping Address is required.",
    path: ["shippingAddress"],
  },
);

router.get("/all", authenticate, authorize("admin"), getAllReservations);

router.get("/user", authenticate, getUserReservations);

router.get("/:id", authenticate, validateId, async (req, res) => {
  try {
    const reservation = await reservationModel
      .findById(req.params.id)
      .populate("service")
      .populate("user", "email firstname");
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Not found." });
    }
    res.status(200).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post(
  "/",
  authenticate,
  validatePayload(reservationSchema),
  addUserReservations,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  validatePayload(updatedReservationAdminSchema),
  updateReservations,
);

router.patch(
  "/user/:id",
  authenticate,
  authorizeOwnerShip(reservationModel),
  validateId,
  validatePayload(updatedReservationSchema),
  updateUserReservations,
);

router.delete(
  "/:id",
  authenticate,
  authorizeOwnerShip(reservationModel),
  validateId,
  async (req, res) => {
    try {
      await reservationModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Deleted successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

export default router;

// getting all the orders(which admin has the access not the users) vs only the orders associated w this user
