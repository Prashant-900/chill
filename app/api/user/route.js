import connectToDatabase from "../dbconnection";
import User from "@/app/models/user";

export async function GET(req) {
  try {
    await connectToDatabase(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return new Response(
        JSON.stringify({ message: "Username is required" }),
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ username }).select("-password"); // Exclude password

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
