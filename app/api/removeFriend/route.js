import connectToDatabase from "../dbconnection";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { username, friendUsername } = body;

    if (!username || !friendUsername) {
      return new Response(
        JSON.stringify({ message: "Username and Friend Username are required" }),
        { status: 400 }
      );
    }

    // Find the user and friend by username
    const user = await User.findOne({ username });
    const friend = await User.findOne({ username: friendUsername });

    if (!user || !friend) {
      return new Response(
        JSON.stringify({ message: "User or Friend not found" }),
        { status: 404 }
      );
    }

    // Remove the friend from the user's friend list
    user.friends = user.friends.filter((friend) => friend !== friendUsername);
    await user.save();

    // Remove the user from the friend's friend list
    friend.friends = friend.friends.filter((friend) => friend !== username);
    await friend.save();

    return new Response(
      JSON.stringify({ message: "Friend removed successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing friend:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
