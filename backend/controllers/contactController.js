import contactModel from "../models/Contact.js";

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newContact = new contactModel({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.log("Error submitting contact form", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { submitContact };