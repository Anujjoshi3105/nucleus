import mongoose from "mongoose";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function POST(req: any) {
  await mongoose.connect(process.env.MONGO_URI || "");

  const { conversationId } = await req.json();

  console.log("Received conversationId:", conversationId);

  if (!conversationId) {
    return Response.json("No conversation ID");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return Response.json("Conversation not found");
  }

  const messages = conversation.messages;

  const fetchedMessages = await Message.find({ _id: { $in: messages } })
    .sort({ createdAt: "asc" })
    .populate("sender", "name , email")
    .populate("seen", "name ,email")
    .exec();

  return Response.json({ messages: fetchedMessages });
}
