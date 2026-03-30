//create a service
import { v2 as cloudinary } from "cloudinary";

const createService = async (req, res) => {
  //admin
  try {
    const { name, price, details, serviceType, availability } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];

    const images = [image1, image2, image3].filter((img) => img !== undefined);

    console.log(images);

    let imagesURL = await Promise.all(
      images.map(async (image) => {
        let result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    console.log(imagesURL);
    
    res
      .status(201)
      .json({ success: true, message: "createService API working" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

//retrieve all services
const getAllServices = async (req, res) => {
  console.log(req);
  res.status(200).json({ message: "getAllServices API working" });
};

//retrieve a specific service
const getService = async (req, res) => {
  res.status(200).json({ message: "getService API working" });
};

//update a specific service
const updateService = async (req, res) => {
  //admin
  res.status(200).json({ message: "updateService API working" });
};

//delete a specific service
const deleteService = async (req, res) => {
  //admin
  res.status(204).json({ message: "deleteService API working" });
};

export {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
};
