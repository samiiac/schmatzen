import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
let result;
try{
result = await cloudinary.uploader.upload("C:\\Users\\user\\OneDrive\\Desktop\\schatzen\\uploads\\1774952862969button.jpg", {
  resource_type: "image",
});
}catch(err){
  console.log(err);
}

console.log(result)