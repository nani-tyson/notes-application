import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;

  // Check for Bearer token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without OTP fields) to request
      req.user = await User.findById(decoded.id).select("-otp -otpExpires");

      if (!req.user) {
        return res.status(401).json({ message: "User not found, unauthorized" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

export default authMiddleware;
