import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import Conversation from '@/models/Conversation';
import { User } from '@/models/User';

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  req:any,
  { params }: { params: IParams }
) {
  try {

    const { conversationId } = params;

     const {userId} = await req.json();

    if (!userId) {
      return Response.json('Unauthorized');
    }

    const existingConversation = await Conversation.findById(conversationId).populate('users').exec();

    if (!existingConversation) {
      return Response.json('Conversation not found');
    }

    // Check if the current user is authorized to delete the conversation
    if (!existingConversation.userIds.includes(userId)) {
      return Response.json('Unauthorized');
    }

    // Delete the conversation
    const deleteResult = await Conversation.deleteMany({
      _id: conversationId,
      userIds: { $in: [userId] },
    });

    if (deleteResult.deletedCount === 0) {
      return Response.json('Conversation not found or unauthorized');
    }

    return Response.json({ message: 'Conversation deleted successfully' });

  } catch (error: any) {
    console.error('ERROR_CONVERSATION_DELETE:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
