import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET_KEY);
};

const registerUser = async (req, res) => {
  const { email, firstname, lastname, phonenumber, password } = req.body;

  const emailExists = await userModel.findOne({ email });

  if (emailExists) {
   return res
      .status(400)
      .json({ success: false, message: "Account already exists." });
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = new userModel({
      email,
      firstname,
      lastname,
      phonenumber,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(200).json({ success: true, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {};

const loginAdmin = async (req, res) => {};

const logout = async (req, res) => {};

export { registerUser, loginUser, loginAdmin, logout };
