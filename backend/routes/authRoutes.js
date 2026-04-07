import { Router } from "express";
import { z } from "zod";
import { getUserProfile, loginUser, logout, registerAdmin, registerUser } from "../controllers/authController.js";
import { validatePayload} from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();

const userRegisterSchema = z.object({
  email: z.email("Invalid email format"),
  firstname: z.string().min(3),
  lastname: z.string().min(1),
  phonenumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  password: z.string().min(6, "Password must have characters more than 5 characters"),
});

router.post("/register", validatePayload(userRegisterSchema), registerUser);

router.post("/login", loginUser);

router.post("/logout", logout);

router.get("/userprofile",authenticate,getUserProfile);

router.post("/admin/register",registerAdmin);

export default router;
