import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import servicesRoutes from "./routes/servicesRoutes.js";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

const app = express();

connectDB();
connectCloudinary();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("heeloiiiuu");
});

app.use("/api/services", servicesRoutes);

export default app;
