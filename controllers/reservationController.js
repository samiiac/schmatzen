import userModel from "../models/User.js";
import serviceModel from "../models/Service.js";
import reservationModel from "../models/Reservation.js";

//add reservations
export const addUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      service,
      serviceType,
      scheduledFor,
      shootLocation,
      shippingAddress,
      notes,
    } = req.body;
    const user = await userModel.findById(userId);

    const serviceDetails = await serviceModel.findById(service);
    console.log([user, serviceDetails]);
    if (!user || !serviceDetails) {
      return res
        .status(400)
        .json({ success: false, message: "No such objects found." });
    }

    const newReservation = new reservationModel({
      user: userId,
      service,
      serviceType,
      scheduledFor,
      shootLocation,
      totalAmount: serviceDetails.pricing[serviceType.toLowerCase()],
      deliveryType: serviceType == "Basic" ? "Digital" : "Digital and Physical",
      shippingAddress,
      notes,
    });
    await newReservation.save();
    res
      .status(201)
      .json({ success: true, message: "Successfully added.", newReservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update the details of user reservations
//admin?or user too some fields?
export const updateReservations = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const updatedReservation = await reservationModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedReservation) {
      return res.status(404).json({ success: false, message: "Not found." });
    }
    res.status(200).json({ success: true, message: "Successfully updated." ,updatedReservation});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserReservations = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    if (req.resource.reservationStatus !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot be performed." });
    }

    if (updatedData.serviceType) {
      updatedData.deliveryType =
        updatedData.serviceType == "Basic" ? "Digital" : "Digital and Physical";
      const serviceDetails = await serviceModel.findById(req.resource.service);
      updatedData.totalAmount =
        serviceDetails.pricing[updatedData.serviceType.toLowerCase()];
    }

    const updatedReservation = await reservationModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedReservation) {
      return res.status(404).json({ success: false, message: "Not found." });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated.",
        updatedReservation,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userReservations = await reservationModel.find({ user: userId });
    if (!userReservations) {
      return res.status(404).json({ success: false, message: "Not found." });
    }
    res.status(200).json({ success: true, userReservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationModel.find({});
    res.status(200).json({ success: true, reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
