import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, otp) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border-radius: 10px; background: #f9f9f9; border: 1px solid #ddd;">
        <h2 style="color: #2c3e50; text-align: center;">🔐 Your OTP Code</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Use the following One-Time Password (OTP) to complete your authentication:
        </p>
        <div style="margin: 20px auto; text-align: center;">
          <span style="display: inline-block; font-size: 28px; font-weight: bold; color: #fff; background: #3498db; padding: 12px 24px; border-radius: 8px; letter-spacing: 2px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #555; text-align: center;">
          ⚠️ This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #777; text-align: center;">
          If you didn’t request this, please ignore this email.<br>
          &copy; ${new Date().getFullYear()} HD Notes
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"HD Notes" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: htmlContent,
    });

    console.log("✅ OTP Email sent to", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};
