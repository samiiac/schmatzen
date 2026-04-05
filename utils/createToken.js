import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createToken = (id, email, role) => {
  const payload = { id: id, email: email, role: role };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};