import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id, email, role) => {
  const payload = { id: id, email: email, role: role };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

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
    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASS
    ) {
      const payload = {
        email: email,
        password: password,
        role: "Admin",
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      return res.status(200).json({ success: true, token });
    }

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

const logout = async (req, res) => {};

export { registerUser, loginUser, logout, registerAdmin };
