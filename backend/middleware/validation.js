import { z } from "zod";
import mongoose from "mongoose";

export const validatePayload = function (schema) {
  return (req, res, next) => {
    try {
     
      const validatedData = schema.parse(req.body);
      console.log(validatedData);
      req.body = validatedData;
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Failed",
          details: error.message,
        });
      }
      next(error);
    }
  };
};

export const validateId = (req, res,next) => {
  try {
    const id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
      next();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid object id." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Invalid object id." });
  }
};
