import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
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
  } catch (err) {
    console.error("❌ Email sending error:", err);
    throw err;
  }
};
