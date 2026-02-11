const { sendVerificationEmail } = require("../utils/sendEmail"); // Reusing the transporter logic implicitly? No, sendEmail exports specific function.
// I need to see if I can export the transporter or write a generic sendEmail function.
// Checking utils/sendEmail.js again.
// It exports { sendVerificationEmail }. The transporter is not exported.
// I should probably refactor sendEmail.js to export a generic send function or the transporter.
// However, to avoid breaking changes right now, I'll create a new utility or just duplicate the transporter setup if it's small, OR refactor sendEmail.js.
// Refactoring sendEmail.js is better.

// Let's refactor sendEmail.js first.
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendContactEmail = async (name, email, message) => {
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender address (might be overridden by gmail to EMAIL_ID but sets Reply-To usually)
        to: process.env.EMAIL_ID, // Send TO the site admin
        replyTo: email,
        subject: `Contact Form: Message from ${name}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };
