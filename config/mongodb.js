import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MONGODB connection established.");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/schatzen`);
  } catch (error) {
    console.log("db connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
