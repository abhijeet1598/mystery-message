import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export const POST = async (request: Request) => {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const existingUser = await UserModel.findOne({
      username,
    });
    if (!existingUser) {
      return Response.json(
        { success: false, message: "User does not exist" },
        { status: 404 }
      );
    }

    const isCodeCorrect = existingUser.verifyCode == code;
    const isCodeNotExpired = existingUser.verifyCodeExpiry > new Date();

    if (isCodeCorrect && isCodeNotExpired) {
      existingUser.isVerified = true;
      await existingUser.save();
      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired. Please signup again to get a new verification code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error while verifying code", error);
    return Response.json({
      success: false,
      message: `Error while verifying code: ${error}`,
    });
  }
};
