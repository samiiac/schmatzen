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
    default: true,
  },
  images: {
    type: [String],
  },
  deliveryType: {
    type: String,
    enum: ["Digital", "Digital and Physical"],
    required: true,
  },

},{timestamps:true});

// serviceSchema.pre('save',function(next){ didnt workk
//   if(this.serviceType == 'Basic'){
//     this.deliveryType = 'Digital';
//   }else{
//     this.deliveryType = 'Digital and Physical';
//   }
//   next();
// })

const serviceModel =
  mongoose.models.services || mongoose.model("service", serviceSchema);

export default serviceModel;
