import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  image: { type: String },
  password: { type: String, required: true },
  friends: [{ type: String }],
  messages: [
    {
      userimage: { type: String },
      username: { type: String },
      text: { type: String },
      image: [{ type: String }],
    },
  ],
  history: [
    {
      from: { type: String },
      to: { type: String },
      text: { type: String },
      image: [{ type: String }],
      timestamp: { type: Date, default: Date.now }, // Timestamp for each history entry
    },
  ],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
