import nodemailer from "nodemailer";
import User from "../models/userModel";
import logger from "./logger";
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string; 
  sendToAdmins?: boolean;

}

export const sendEmail = async ({ to, subject, text, html,  sendToAdmins = false  }: EmailOptions) => {
  try {
    // agar adminEmails exist kare
let adminEmails: string[] = [];
if(sendToAdmins) {
  const admins = await User.find({ role: "admin" }).select("email");
  adminEmails = admins.map(a => a.email);
}
    // Create transporter
        //   const admins = await User.find({ role: "admin" }).select("email");
        // const adminEmails = admins.map(a => a.email);

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
     ...(sendToAdmins && { bcc: adminEmails.join(",") }),
      subject,
      text,
      html: html || `<div>${text}</div>`, 
    };

    // Send email
    await transporter.verify();
    // logger.info("SMTP connection verified");
    await transporter.sendMail(mailOptions);
    // logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
