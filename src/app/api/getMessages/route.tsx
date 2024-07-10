import mongoose from 'mongoose';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

export async function POST(req) {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);

    const { conversationId } = await req.json();

    console.log('Received conversationId:', conversationId);
    if (!conversationId) {
      return new Response(JSON.stringify({ error: 'No conversation ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const conversation = await Conversation.findById(conversationId );
     
    const messageIds = conversation.messageIds;

    
    let fetchedMessages = [];

   
    for (const messageId of messageIds) {
      const message = await Message.findById(messageId)
        .sort({ createdAt: 'asc' })
        .populate('sender', 'name')
        .populate('seen', 'name')
        .exec();

      if (message) {
        fetchedMessages.push(message);
      }
    }

     
    console.log('Fetched messages:', { messages: fetchedMessages });

    return new Response(JSON.stringify({ messages: fetchedMessages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } 
  }

