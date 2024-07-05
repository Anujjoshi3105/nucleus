import mongoose from 'mongoose';
import Message, { IMessage } from '@/models/Message'; // Adjust import path as needed
import { IUser } from '@/models/User'; // Adjust import path as needed

const getMessages = async (conversationId: string): Promise<IMessage[]> => {
  try {
    const messages = await Message.find({
      conversationId: new mongoose.Types.ObjectId(conversationId)
    })
    .populate('sender', 'name') // Populate sender field with user's name
    .populate('seen', 'name')  // Populate seen field with user's name
    .exec(); // Execute the query

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export default getMessages;
