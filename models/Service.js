import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    enum: ["Basic", "Premium"],
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
  },
  images: {
    type: [String],
  },
  deliveryType: {
    type: String,
    enum: ["Digital", "Digital and Physical"],
    required: true,
  },
});

const serviceModel = mongoose.models.services || mongoose.model("service", serviceSchema);

export default serviceModel;
