"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        // Create transporter
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // ✅ ignores self-signed cert
            },
        });
        //  mail options
        const mailOptions = {
            from: `"Logistics App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || `<p>${text}</p>`, // fallback to text if html not provided
        };
        // Send email
        await transporter.verify();
        console.log("✅ SMTP connection verified");
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${to}`);
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email could not be sent");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map