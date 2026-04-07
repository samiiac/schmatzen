import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";

const registerUser = async (req, res) => {
  const { email, firstname, lastname, phonenumber, password } = req.body;

  try {
    const emailExists = await userModel.findOne({ email });

    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Account already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      email,
      firstname,
      lastname,
      phonenumber,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id, user.email, user.role);

    res.status(201).json({ success: true, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or password." });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or password." });
    }

    const token = createToken(user._id, user.email, user.role);
    res.status(200).json({ success: true, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { email, firstname, lastname, phonenumber, password, admin_secret } =
      req.body;
    console.log(process.env.ADMIN_REGISTRATION_ENABLED);
    if (
      process.env.ADMIN_REGISTRATION_ENABLED === "true" &&
      admin_secret === process.env.ADMIN_SECRET
    ) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new userModel({
        email,
        firstname,
        lastname,
        phonenumber,
        password: hashedPassword,
        role: "admin",
      });
      const user = await newUser.save();
      const token = createToken(user._id, user.email, user.role);
      res.status(201).json({ success: true, token: token });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Error registering Admin." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false,message:"No object found." });
    }
   
    res.status(200).json({ success: true, user});
  } catch (error) {
    console.log("Error getting user profile", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {};

export { registerUser, loginUser, logout, registerAdmin, getUserProfile };
