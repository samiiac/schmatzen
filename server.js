import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import serviceRoutes from "./routes/serviceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { authenticate } from "./middleware/auth.js";

const app = express();

connectDB();
connectCloudinary();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//server health
app.get("/health", (req, res) => {
  res.send("heeloiiiuu");
});

//api endpoints
app.use("/api/services", serviceRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/reservations",authenticate,reservationRoutes);

export default app;
