import nodemailer from "nodemailer";
import VerificationEmail from "../../emails/VerificationEmail";
import { render } from "@react-email/render";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.NODEMAILER_GUSERNAME,
    pass: process.env.NODEMAILER_GPASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendVerificationEmailNM(
  email: string,
  username: string,
  verifyCode: string
) {
  // send mail with defined transport object
  try {
    const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));
    const info = await transporter.sendMail({
      from: '"Team Mystery Message" <info@mysterymessage.com>', // sender address
      to: email, // list of receivers
      subject: "Verification Code | Mystery Message", // Subject line
      // text: "Hello world?", // plain text body
      html: emailHtml, // html body
    });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error while sending verification email ", error);
    return {
      success: false,
      message: "Error while sending verification email",
    };
  }
}
