import mongoose from 'mongoose';
import UserProfile from '@/models/Profile';
import Conversation from '@/models/Conversation'
import Message from '@/models/Message';
import { User } from '@/models/User';

  export async function POST(req:any){

    await mongoose.connect(process.env.MONGO_URI);

   
    const { message, image, conversationId, sessionId } = await req.json();

    const currentUser = await User.findById(sessionId);

    if (!currentUser?.id || !currentUser?.email) {
        return Response.json('Unauthorized');
      }
   
     // Create a new message
    let newMessage = await Message.create({
        body: message,
        image: image,
        conversation: conversationId,
        sender: currentUser.id,
        seen: [currentUser.id], 
      });

      newMessage = await Message.findById(newMessage._id)
      .populate('seen')
      .populate('sender')
      .exec();


      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessageAt: new Date(),
          $push: { messages: newMessage._id },
        },
        { new: true }
      )
      .populate('users')
      .populate({
        path: 'messages',
        populate: { path: 'seen' }
      })
      .exec();

      return Response.json(newMessage);
     
  }

  