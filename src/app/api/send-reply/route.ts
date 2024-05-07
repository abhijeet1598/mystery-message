import ResponseEmail from "../../../../emails/ResponseEmail";
import { sendResponseEmail } from "@/helpers/sendResponseEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request: Request) {
  dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const { messageId, replyMessage } = await request.json();

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const senderMessage = user.messages.find(
      (message) => message._id == messageId
    );

    if (!senderMessage) {
      return Response.json(
        {
          success: false,
          message: "Message not found",
        },
        { status: 404 }
      );
    }

    if (senderMessage.senderEmail == "") {
      return Response.json(
        {
          success: false,
          message: "Sender has not opted for a reply",
        },
        { status: 404 }
      );
    }
    await UserModel.findOneAndUpdate(
      {
        _id: userId,
        "messages._id": messageId,
      },
      {
        $set: { "messages.$.isReplied": true },
      }
    );
    const emailResponse = await sendResponseEmail(
      replyMessage,
      user.username,
      senderMessage.senderEmail
    );
    return Response.json(
      {
        success: true,
        message: emailResponse.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while finding message ", error);
    return Response.json(
      {
        success: false,
        message: "Error while finding message",
      },
      { status: 500 }
    );
  }
}
