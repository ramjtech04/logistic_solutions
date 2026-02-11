"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const userModel_1 = __importDefault(require("../models/userModel"));
const logger_1 = __importDefault(require("./logger"));
const sendEmail = async ({ to, subject, text, html, sendToAdmins = false }) => {
    try {
        // agar adminEmails exist kare
        let adminEmails = [];
        if (sendToAdmins) {
            const admins = await userModel_1.default.find({ role: "admin" }).select("email");
            adminEmails = admins.map(a => a.email);
        }
        // Create transporter
        //   const admins = await User.find({ role: "admin" }).select("email");
        // const adminEmails = admins.map(a => a.email);
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        //  mail options
        const mailOptions = {
            from: `"Logistics App" <${process.env.EMAIL_USER}>`,
            to,
            ...(sendToAdmins && { bcc: adminEmails.join(",") }),
            subject,
            text,
            html: html || `<div>${text}</div>`,
        };
        // Send email
        await transporter.verify();
        logger_1.default.info("SMTP connection verified");
        await transporter.sendMail(mailOptions);
        logger_1.default.info(`Email sent to ${to}`);
    }
    catch (error) {
        logger_1.default.error("Error sending email:", error);
        throw new Error("Email could not be sent");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map