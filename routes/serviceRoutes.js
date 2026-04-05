import { Router } from "express";
import {
  validateId,
  validatePayload
} from "../middleware/validation.js";
import { z } from "zod";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  createService,
  deleteService,
  getAllServices,
  getService,
  updateService,
} from "../controllers/serviceController.js";
import upload from "../middleware/multer.js";

const serviceSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters" }),
  pricing: z.object({
    basic:z.coerce.number().positive({ message: "Price must be positive" }),
    premium:z.coerce.number().positive({ message: "Price must be positive" }),
  }),
  details: z.string(),
  availability: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val; 
  }, z.boolean())
});

const updatedServiceSchema = serviceSchema.partial();

const router = Router();

router.get("/", getAllServices);

router.get("/:id", validateId, getService);

router.post(
  "/",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  validatePayload(serviceSchema),
  createService,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  validatePayload(updatedServiceSchema),
  updateService,
);

router.delete("/:id", authenticate,authorize("admin"), validateId, deleteService);

export default router;
