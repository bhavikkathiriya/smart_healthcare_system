const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `"MediCare Pro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for MediCare Pro Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1b8bf1; margin: 0;">MediCare Pro</h1>
          <p style="color: #64748b; margin: 5px 0;">Smart Healthcare Management</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #1e293b; margin-top: 0;">Hello, ${name}! 👋</h2>
          <p style="color: #475569;">Thank you for registering with MediCare Pro. Use the OTP below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #1b8bf1, #04c5b5); padding: 20px 40px; border-radius: 12px;">
              <h1 style="color: white; margin: 0; font-size: 42px; letter-spacing: 10px;">${otp}</h1>
            </div>
          </div>
          <p style="color: #475569;">This OTP is valid for <strong>10 minutes</strong> only.</p>
          <p style="color: #94a3b8; font-size: 13px;">If you did not request this, please ignore this email.</p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">© 2024 MediCare Pro · Secure Healthcare Management</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };