import mongoose from "mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

const getMessages = async (conversationId: any) => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messages = conversation.messages;

    const fetchedMessages = await Message.find({ _id: { $in: messages } })
      .sort({ createdAt: "asc" })
      .populate("sender", "name")
      .populate("seen", "name")
      .exec();

    return fetchedMessages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
};

export default getMessages;
