import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pricing: {
      basic: { type: Number, required: true, min: 0 },
      premium: { type: Number, required: true, min: 0 },
    },
    details: {
      type: String,
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
  },
  { timestamps: true },
);

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
