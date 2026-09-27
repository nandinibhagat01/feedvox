import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const user = await UserModel.findOne({
      email: session.user.email,
    }).select("messages");

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

    const messages = [...(user.messages || [])].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

    return Response.json(
      {
        success: true,
        messages,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching messages:", error);

    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      {
        status: 500,
      },
    );
  }
}
