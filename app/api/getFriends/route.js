import connectToDatabase from "../dbconnection";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { usernames } = body;

    if (!usernames || !Array.isArray(usernames)) {
      return new Response(
        JSON.stringify({ message: "Usernames array is required" }),
        { status: 400 }
      );
    }

    // Find users by their usernames
    const users = await User.find({ username: { $in: usernames } }).select(
      "username image status"
    );

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
