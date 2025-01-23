import connectToDatabase from "../dbconnection";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const body = await req.json();
    const { username, friendUsername } = body;

    if (!username || !friendUsername) {
      return new Response(
        JSON.stringify({ message: "Username and Friend Username are required" }),
        { status: 400 }
      );
    }

    // Find the user and friend by username
    const user = await User.findOne({ username }).select("friends");
    const friend = await User.findOne({ username: friendUsername }).select("friends");

    if (!user || !friend) {
      return new Response(
        JSON.stringify({ message: "User or Friend not found" }),
        { status: 404 }
      );
    }

    // Check if the friend is already added for both users
    if (user.friends.includes(friendUsername)) {
      return new Response(
        JSON.stringify({ message: "Friend already added" }),
        { status: 400 }
      );
    }
    if (friend.friends.includes(username)) {
      return new Response(
        JSON.stringify({ message: "Friend already added to their list" }),
        { status: 400 }
      );
    }

    // Add each user to the other's friend list
    user.friends.push(friendUsername);
    friend.friends.push(username);

    // Save both users
    await user.save();
    await friend.save();

    return new Response(
      JSON.stringify({ message: "Friend added successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding friend:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
