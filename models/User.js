import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otp: { type: String },         
    otpExpires: { type: Date },    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
