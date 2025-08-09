import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

console.log("EMAIL_USER:", process.env.EMAIL_USER); // check these logs
console.log("EMAIL_PASS:", process.env.EMAIL_PASS );

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // From .env
    pass: process.env.EMAIL_PASS, // App password, not your real Gmail password
  },
});

export const sendResetEmail = async (to, link) => {
  const mailOptions = {
    from: `Connectly <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Password",
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Reset email sent to", to);
  } catch (err) {
    console.error("❌ Email sending error:", err);
    throw err;
  }
};
