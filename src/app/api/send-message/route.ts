import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        {
          status: 404,
        },
      );
    }

    // is user accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        {
          status: 403,
        },
      );
    }
    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error adding messages:", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
