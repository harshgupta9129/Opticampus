import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};
