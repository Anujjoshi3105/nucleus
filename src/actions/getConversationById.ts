import mongoose from "mongoose";
import Conversation from "@/models/Conversation";
// Assuming Response is imported from express or a similar framework

export async function getConversationById(conversationId: any) {
  await mongoose.connect(process.env.MONGO_URI || "");

  const conversation = await Conversation.findById(conversationId)
    .populate("users")
    .exec();

  if (!conversation) {
    return "Conversation not found";
  }

  return conversation;
}
