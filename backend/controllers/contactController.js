const { sendContactEmail } = require("../utils/sendContactEmail");

const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await sendContactEmail(name, email, message);

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

module.exports = { submitContactForm };
