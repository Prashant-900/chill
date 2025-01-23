import connectToDatabase from "../dbconnection";
import User from "@/app/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectToDatabase(); // Connect to the database

    const body = await req.json();
    const { username, image, password } = body;

    // Check for missing fields
    if (!username || !password) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username:username,
      image : image ,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
