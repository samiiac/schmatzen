import { Router } from "express";
import { z } from "zod";
import {
  createContactMessage,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { validateId, validatePayload } from "../middleware/validation.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();


const contactSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().optional(),
  email: z.string().email(),
  phonenumber: z.string().min(5).optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});


const updateContactSchema = z.object({
  status: z.enum(["pending", "resolved"]).optional(),
});


router.post("/", validatePayload(contactSchema), createContactMessage);

/**
 * ADMIN: get all messages
 */
router.get("/", authenticate, authorize("admin"), getAllContacts);

/**
 * ADMIN: get single message
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  getContactById
);

/**
 * ADMIN: update status
 */
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  validatePayload(updateContactSchema),
  updateContactStatus
);

/**
 * ADMIN: delete message
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  deleteContact
);

export default router;