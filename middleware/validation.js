import { z } from "zod";

export const validateServiceBody = function (serviceSchema) {
  return (req, res, next) => {
    try {
      const validatedData = z.parse(serviceSchema, req.body);
      req.body = validatedData;
      next();
    } catch (error) {
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

export const validateUserRegister = function (userSchema) {
  return (req, res, next) => {
    try {
      const validatedData = z.parse(userSchema, req.body);
      req.body = validatedData;
      next();
    } catch (error) {
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
