const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send a verification email with a clickable link.
 * @param {string} to - recipient email
 * @param {string} token - verification token
 */
const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"TrustLayer" <${process.env.EMAIL_ID}>`,
    to,
    subject: "Verify your TrustLayer account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 30px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1e293b; font-size: 24px; margin: 0;">TrustLayer</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Blockchain Certificate Verification</p>
        </div>
        <div style="background: #ffffff; padding: 28px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">Verify your email address</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Thank you for registering! Please click the button below to verify your email and activate your account.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verifyUrl}" 
               style="display: inline-block; background: #1e293b; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">
              Verify Email
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${verifyUrl}" style="color: #3b82f6; word-break: break-all;">${verifyUrl}</a>
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send an OTP email for password reset.
 * @param {string} to - recipient email
 * @param {string} otp - 6-digit OTP
 */
const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"TrustLayer" <${process.env.EMAIL_ID}>`,
    to,
    subject: "Password Reset OTP – TrustLayer",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 30px; background: #f5f5f7; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1d1d1f; font-size: 24px; margin: 0;">TrustLayer</h1>
          <p style="color: #86868b; font-size: 14px; margin-top: 4px;">Blockchain Certificate Verification</p>
        </div>
        <div style="background: #ffffff; padding: 28px; border-radius: 12px;">
          <h2 style="color: #1d1d1f; font-size: 18px; margin-top: 0;">Password Reset</h2>
          <p style="color: #424245; font-size: 14px; line-height: 1.6;">
            You requested a password reset. Use the OTP below to verify your identity:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <div style="display: inline-block; background: #1d1d1f; color: #f5f5f7; padding: 16px 40px; border-radius: 12px; font-size: 32px; letter-spacing: 8px; font-weight: 700;">
              ${otp}
            </div>
          </div>
          <p style="color: #86868b; font-size: 12px; line-height: 1.5;">
            This OTP expires in <strong>10 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendOtpEmail };
