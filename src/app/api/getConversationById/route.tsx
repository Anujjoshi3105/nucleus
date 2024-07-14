import mongoose from "mongoose";
import UserProfile from "@/models/Profile";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { User } from "@/models/User";

export async function POST(req: any) {
  await mongoose.connect(process.env.MONGO_URI || "");

  const { conversationId, sessionUserId } = await req.json();

  if (!sessionUserId) {
    return Response.json("User ID is required");
  }

  const conversation = await Conversation.findById(conversationId)
    .populate("users")
    .exec();

  if (!conversation) {
    return Response.json({ error: "Conversation not found" });
  }

  const userInConversation = conversation.userIds.some(
    (userId: mongoose.Types.ObjectId) => userId.equals(sessionUserId)
  );

  if (!userInConversation) {
    return Response.json({ error: "Access denied" });
  }

  return Response.json(conversation);
}
