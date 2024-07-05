import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import UserProfile from '@/models/Profile';
import Conversation from '@/models/Conversation';


export async function POST(req:any){
  
    await mongoose.connect(process.env.MONGO_URI);

   
    const { conversationId, sessionUserId } =await req.json();

    if (!conversationId || !sessionUserId) {
        return Response.json( 'Conversation ID and session user ID are required' );
      }
    
      const conversation = await Conversation.findById(conversationId).exec();

      if (!conversation) {
        return Response.json({ error: 'Conversation not found' });
      }
     
      const otherUserId = conversation.userIds.find((id: string) => id.toString() !== sessionUserId);
    

      if (!otherUserId) {
        return Response.json({ error: 'Other user not found' });
      }
     
      const otherUserProfile = await UserProfile.findOne({ user: otherUserId }).exec();

      if (!otherUserProfile) {
        return Response.json('Other user profile not found' );
      }


      return Response.json({ name: otherUserProfile.name });
}