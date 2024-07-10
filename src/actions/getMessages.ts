import mongoose from 'mongoose';
import Message from '@/models/Message';

const getMessages = async (conversationId) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const messages = await Message.find({ conversationId: conversationId })
      .sort({ createdAt: 'asc' })
      .populate('sender', 'name')
      .populate('seen', 'name')
      .exec();

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  } finally {
    mongoose.connection.close();
  }
};

export default getMessages;
