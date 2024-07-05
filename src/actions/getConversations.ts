import mongoose from 'mongoose';
import { User } from '@/models/User';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import getSession from './getSession';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const conversations = await Conversation.find({
      userIds: currentUser.id
    })
    .sort({ lastMessageAt: 'desc' })
    .populate('users', 'User')
    .populate({
      path: 'messages',
      model: 'Message',
      populate: {
        path: 'sender seen',
        model: 'User'
      }
    });

    return Response.json({ conversations: conversations || [] });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export default getConversations;
