import connectToDatabase from "../dbconnection";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const body = await req.json();
    const { userId, messageId } = body; // Ensure you pass both userId and messageId in the request body

    // Find the user by ID
    const user = await User.findOne({username: userId});
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }

    // Check if the message exists in the user's messages array
    const messageIndex = user.messages.findIndex(
      (message) => message._id.toString() === messageId
    );

    if (messageIndex === -1) {
      return new Response(
        JSON.stringify({ message: "Message not found." }),
        { status: 404 }
      );
    }

    // Remove the message
    user.messages.splice(messageIndex, 1);
    await user.save();

    return new Response(
      JSON.stringify({ message: "Message deleted successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete message." }),
      { status: 500 }
    );
  }
}
