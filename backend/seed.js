import mongoose from "mongoose";
import userModel from "./models/User.js";
import serviceModel from "./models/Service.js";
import reservationModel from "./models/Reservation.js";
import wishlistModel from "./models/Wishlist.js";
import contactModel from "./models/Contact.js";
import connectDB from "./config/mongodb.js";

const MONGO_URI = process.env.MONGO_URI;
const seed = async () => {
  try {
    await connectDB();
    console.log("DB connected");

    // clear existing data (optional but common in seed)
    await Promise.all([
      userModel.deleteMany({}),
      serviceModel.deleteMany({}),
      reservationModel.deleteMany({}),
      wishlistModel.deleteMany({}),
      contactModel.deleteMany({}),
    ]);

    console.log("Old data cleared");

    // USERS
    const users = await userModel.insertMany([
      {
        email: "admin@test.com",
        firstname: "Admin",
        lastname: "User",
        phonenumber: "9800000000",
        password: "hashedpassword",
        
      },
      {
        email: "user@test.com",
        firstname: "Normal",
        lastname: "User",
        phonenumber: "9811111111",
        password: "hashedpassword",
       
      },
    ]);

    // SERVICES
    const services = await serviceModel.insertMany([
      {
        name: "Wedding Photography",
        pricing: {
          basic: 500,
          premium: 1200,
        },
        details: "Full wedding coverage package",
        availability: true,
        images: [],
      },
      {
        name: "Portrait Shoot",
        pricing: {
          basic: 100,
          premium: 250,
        },
        details: "Studio portrait photography",
        availability: true,
        images: [],
      },
    ]);

    // RESERVATIONS
    const reservations = await reservationModel.insertMany([
      {
        user: users[1]._id,
        service: services[0]._id,
        serviceType: "Basic",
        deliveryType: "Digital",
        scheduledFor: new Date(),
        shootLocation: "Kathmandu",
        totalAmount: 500,
        reservationStatus: "pending",
        paymentStatus: "pending",
      },
    ]);

    // WISHLIST
    await wishlistModel.insertMany([
      {
        user: users[1]._id,
        service: services[1]._id,
      },
    ]);

    // CONTACT
    await contactModel.insertMany([
      {
        firstname: "Test",
        lastname: "User",
        email: "test@mail.com",
        phonenumber: "9800000000",
        subject: "Inquiry",
        message: "I want to book a shoot",
      },
    ]);

    console.log("Seed completed");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();