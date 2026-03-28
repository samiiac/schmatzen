import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        
    },
    lastname:{
        type:String,
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const userModel = mongoose.models.users || mongoose.model('user',userSchema);

export default userModel;