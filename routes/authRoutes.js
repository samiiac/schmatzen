import { Router } from "express";
import { z } from "zod";
import { registerUser } from "../controllers/userController.js";
import { validateUserRegister } from "../middleware/validation.js";
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

router.post("/signup", validateUserRegister(userRegisterSchema), registerUser);

router.post("/login", (req, res) => {});

router.post("/logout", (req, res) => {});

export default router;
