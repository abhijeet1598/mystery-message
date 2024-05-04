import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const updatedUser = await UserModel.updateOne(
      {
        _id: _user._id,
      },
      {
        $pull: {
          messages: { _id: messageId },
        },
      }
    );

    if (updatedUser.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while delete message ", error);
    return Response.json(
      {
        success: false,
        message: "Error while delete message",
      },
      { status: 500 }
    );
  }
}
