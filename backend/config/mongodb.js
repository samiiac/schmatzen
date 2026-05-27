import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connection.on("connected", () => {
  console.log("MONGODB connection established.");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "schatzen",
    });
  } catch (error) {
    console.log("db connection failed", error);
    process.exit(1);
  }
};

export default connectDB;