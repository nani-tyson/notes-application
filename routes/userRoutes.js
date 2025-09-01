import express from "express";
import {
  signup,
  signin,
  verifyOtp
} from "../controllers/userController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify-otp", verifyOtp);

export default router;
