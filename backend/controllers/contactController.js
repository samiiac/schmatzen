import contactModel from "../models/Contact.js";

/**
 * CREATE CONTACT MESSAGE (PUBLIC)
 */
export const createContactMessage = async (req, res) => {
  try {
    const { firstname, lastname, email, phonenumber, subject, message } =
      req.body;

    const newContact = new contactModel({
      firstname,
      lastname,
      email,
      phonenumber,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      newContact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET ALL CONTACT MESSAGES (ADMIN)
 */
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactModel.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET SINGLE CONTACT MESSAGE (ADMIN)
 */
export const getContactById = async (req, res) => {
  try {
    const id = req.params.id;

    const contact = await contactModel.findById(id);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Not found." });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE CONTACT STATUS (ADMIN)
 */
export const updateContactStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const updated = await contactModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Not found." });
    }

    res.status(200).json({
      success: true,
      message: "Status updated.",
      updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE CONTACT MESSAGE (ADMIN)
 */
export const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await contactModel.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Not found." });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};