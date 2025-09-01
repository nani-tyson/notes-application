import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../configs/mailer.js";


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


export const signup = async (req, res) => {
  try {
    const { name, dob, email } = req.body;
    if (!name || !dob || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists, please signin" });
    }
    
    const otp = crypto.randomInt(100000, 999999).toString();

    user = new User({
      name,
      dob,
      email,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000 
    });

    await user.save();

    console.log(`✅ OTP for ${email}: ${otp}`); 
    sendEmail(email, "Your Signup OTP", `Your OTP is ${otp}. It is valid for 5 minutes.`);

    res.json({ message: "Signup OTP sent (check console for demo)" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const signin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found, please signup" });

    
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log(`✅ OTP for ${email}: ${otp}`);
    sendEmail(email, "Your Signin OTP", `Your OTP is ${otp}. It is valid for 5 minutes.`);
    res.json({ message: "Signin OTP sent (check console for demo)" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- VERIFY OTP ---
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP after verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- GET PROFILE ---
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-otp -otpExpires");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
