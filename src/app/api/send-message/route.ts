import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content, senderEmail } = await request.json();
  console.log("email", senderEmail);
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
      senderEmail,
    };
    user.messages.push(newMessage as Message);
    await user.save();
    console.log(newMessage);
    console.log(user);
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while sending message", error);
    return Response.json(
      {
        success: false,
        message: "Error while sending message",
      },
      {
        status: 500,
      }
    );
  }
}
