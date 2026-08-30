import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { usernameValidation } from "@/src/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    // 1. Get username from URL query parameters
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    // 2. Validate username with Zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 },
      );
    }

    // 3. Get validated username
    const { username } = result.data;

    // 4. Search MongoDB for an existing verified user
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isverified: true,
    });

    // 5. Username is already taken
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }

    // 6. Username is available
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking username:", error);

    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 },
    );
  }
}
