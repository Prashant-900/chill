import connectToDatabase from "../dbconnection";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const body = await req.json();
    const { history, message } = body;

    // Validation for necessary fields in the history and message
    if (!history || !message || !history.from || !history.to) {
      return new Response(
        JSON.stringify({ message: "Sender, recipient, history, and message are required." }),
        { status: 400 }
      );
    }

    // Find the sender and recipient in the database
    const sender = await User.findOne({ username: history.from })
    const recipient = await User.findOne({ username: history.to })

    if (!sender || !recipient) {
      return new Response(
        JSON.stringify({ message: "Sender or recipient not found." }),
        { status: 404 }
      );
    }

    // Initialize history arrays if undefined
    if (!sender.history) sender.history = [];
    if (!recipient.history) recipient.history = [];

    // Add the provided history to both users
    sender.history.push(history); // Mark as sent for sender
    recipient.history.push(history); // Mark as received for recipient

    // Ensure messages array exists for the recipient
    if (!recipient.messages) {
      recipient.messages = [];
    }

    recipient.messages.push({
      userimage: message.userimage,
      username: message.username,
      text: message.text,
      image: message.image,
    });

    // Save both users
    await sender.save();
    await recipient.save();

    return new Response(
      JSON.stringify({ message: "History and message updated successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating history and sending message:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 }
    );
  }
}
