import mongoose from 'mongoose';
import Conversation from '@/models/Conversation';
import UserProfile from '@/models/Profile'; // Assuming you have a Profile model
import getCurrentUser from './getCurrentUser'; // Adjust the import path as needed

const getConversationById = async (conversationId) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    // Ensure the conversation ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return null;
    }

    const conversation = await Conversation.findById(conversationId)
      .populate('users')
      .exec();

    return conversation;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }
};

export default getConversationById;
