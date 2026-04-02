import { Router } from "express";
import { validateServiceBody, validateUpdatedServiceBody } from "../middleware/validation.js";
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
  price: z.number().positive({ message: "Price must be positive" }),
  details: z.string(),
  serviceType: z.enum(["Basic", "Premium"]),
  availability: z.boolean(),
});

const updateServiceSchema = serviceSchema.partial();

const router = Router();

router.get("/", getAllServices);

router.get("/:id", getService);

router.post("/", upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1}]),createService);

router.patch("/:id",validateUpdatedServiceBody(updateServiceSchema), updateService);

router.delete("/:id", authorize,authenticate,deleteService);

export default router;
