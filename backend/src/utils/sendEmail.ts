import nodemailer from "nodemailer";
import User from "../models/userModel";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string; 
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    // Create transporter
      const admins = await User.find({ role: "admin" }).select("email");
    const adminEmails = admins.map(a => a.email);

    const transporter = nodemailer.createTransport({
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
      bcc: adminEmails,
      subject,
      text,
      html: html || `<div>${text}</div>`, 
    };

    // Send email
    await transporter.verify();
    console.log("SMTP connection verified");
    await transporter.sendMail(mailOptions);
    console.log(` Email sent to ${to}`);
  } catch (error) {
    console.error(" Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
