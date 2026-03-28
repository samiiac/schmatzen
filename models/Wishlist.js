import mongoose from "mongoose";



const wishlistSchema = new mongoose.Schema({
   userId,
   services:[{type:Schema.Types.ObjectId,ref:'serviceModel'}]
   
})

const wishlistModel = mongoose.models.wishlists || mongoose.model('wishlist',userSchema);

export default wishlistModel;