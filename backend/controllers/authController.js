
import User from "../models/User.js";
import crypto from "crypto";
import { generateToken } from "../utils/auth.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // STUDENT EMAIL VALIDATION (UNCHANGED LOGIC)
    if (role === "student") {
      const studentEmailRegex =
        /^(2022|2023|2024|2025)(kuec|kucp|kuad)\d{4}@iiitkota\.ac\.in$/;

      if (!studentEmailRegex.test(email)) {
        return res.status(400).json({
          message:
            "Only IIIT Kota student emails (2022–2025, kuec/kucp/kuad) allowed",
        });
      }
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  HASH PASSWORD (UNCHANGED)
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // CREATE USER (NO OTP NOW)
    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      isEmailVerified: true,
    });

    //  CREATE TOKEN (UNCHANGED FLOW)
    const token = generateToken({ userId: newUser._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Registration successful",
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  CHECK USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // HASH PASSWORD
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    //  COMPARE PASSWORD
    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //  GENERATE TOKEN
    const token = generateToken({ userId: user._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    //  RETURN USER DATA
    return res.status(200).json({
      message: "Login successful",
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
