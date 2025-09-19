import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string; // optional (for styled emails)
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // can change to Outlook, SendGrid, etc.
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // app password (not your raw password!)
      },
    });

    // ✅ Define mail options
    const mailOptions = {
      from: `"Logistics App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`, // fallback to text if html not provided
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
