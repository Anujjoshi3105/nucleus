import mongoose from 'mongoose';
import UserProfile from '@/models/Profile'
import { getCurrentUser } from '@/app/lib/auth';
import Converstion from '@/models/Converstion';

  export async function POST(req:any){

    await mongoose.connect(process.env.MONGO_URI);

   
    const body =await req.json();

    const {
      currentUserId,
       userId,
       isGroup,
       members,
       name
    } =body;
    
   

    if (!userId) {
        return Response.json({ message: 'Invalid friend ID' });
      }

      if(isGroup && (!members || members.length<2||!name)){
        return Response.json('Invalid group Data');
      }

      if (isGroup) {
        const newConversation = new Conversation({
          name,
          isGroup,
          users: [...members.map((member: { value: string }) => member.value), currentUserId]
        });
    
        await newConversation.save();

        return  Response.json('newconversation');

      }

      const existingConversations = await Conversation.find({
        $or: [
          { users: { $all: [currentUserId, userId] } },
          { users: { $all: [userId, currentUserId] } }
        ]
      });

      const singleConversation =existingConversations[0];

      if(singleConversation){
        return Response.json(singleConversation);
      }

      const newConversation = new Conversation({
        users: [currentUserId, userId]
      });
    
      await newConversation.save();
    

      return Response.json(newConversation);

  
   
     
  }

  