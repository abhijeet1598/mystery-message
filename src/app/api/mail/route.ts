// import VerificationEmail from "../../../../emails/verificationEmail";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: Request) {
//   const { username, otp } = await request.json();
//   try {
//     const data = await resend.emails.send({
//       from: "info@beverde.in",
//       to: ["abhiclasher152@gmail.com"],
//       subject: "Hello world",
//       react: VerificationEmail({ username, otp }),
//     });

//     return Response.json(data);
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }

import nodemailer from "nodemailer";
import VerificationEmail from "../../../../emails/VerificationEmail";
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
export async function POST(request: Request) {
  const { username, otp } = await request.json();
  const emailHtml = render(VerificationEmail({ username, otp }));
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: `${username} from MM <info@mysterymessage.com>`, // sender address
      to: "abhiclasher152@gmail.com", // list of receivers
      subject: "Verification Code | Mystery Message", // Subject line
      // text: "Hello world?", // plain text body
      html: emailHtml, // html body
    });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    return Response.json({
      success: true,
      message: info,
    });
  } catch (error) {
    console.error("Error while sending email ", error);
    return Response.json({
      success: false,
      message: "Error while sending email",
    });
  }
}
