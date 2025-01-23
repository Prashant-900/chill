import connectToDatabase from "../dbconnection";
import User from "@/app/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectToDatabase(); // Connect to the database

    const body = await req.json();
    const { username, password } = body;

    // Check for missing fields
    if (!username || !password) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return new Response(JSON.stringify({ message: "User does not exist" }), { status: 404 });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }


    return new Response(
      JSON.stringify({ message: "Login successful" }), // Include token in response if generated
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
