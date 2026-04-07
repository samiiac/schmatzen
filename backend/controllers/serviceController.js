//create a service
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import path from "path";
import serviceModel from "../models/Service.js";
import mongoose from "mongoose";

const createService = async (req, res) => {
  //admin
  try {
    const { name, pricing, details, availability } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];

    const images = [image1, image2, image3].filter((img) => img !== undefined);

    let imagesURL = images.map((img) => {
      return `${req.protocol}://${req.get("host")}/uploads/${img.filename}`;
    });
    console.log(imagesURL);
    const newService = new serviceModel({
      name,
      pricing:{
        basic:pricing.basic,
        premium:pricing.premium
      },
      details,
      availability,
      images: imagesURL,
    });
    console.log(newService);

    await newService.save();
    if(!newService){
      return res.status(400).json({ success: false, message: "Error creating service." });
    }
    res
      .status(201)
      .json({ success: true, message: "Service Added Successfully",service : newService });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};

//retrieve all services
const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.find({});
    res.status(200).json({ success: true, services: services });
  } catch (error) {
    console.log("Error while fetching services", error);
    res.status(500).json({ message: error.message });
  }
};

//retrieve a specific service
const getService = async (req, res) => {
  console.log(req.params.id);
  try {
    const id = req.params.id;
    const serviceDetails = await serviceModel.findById(id);
    if (!serviceDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }
    res.status(200).json({ success: true, serviceDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update a specific service
const updateService = async (req, res) => {
  //admin
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const updatedService = await serviceModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service Updated", updatedService });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a specific service
const deleteService = async (req, res) => {
  console.log(req.params);
  try {
    const id = req.params.id;

    const deleted = await serviceModel.findByIdAndDelete(req.params.id); //params or body?
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
};
