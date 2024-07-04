import mongoose from 'mongoose';
import UserProfile from '@/models/Profile';
import Conversation from '@/models/Conversation'
import Message from '@/models/Message';
import { User } from '@/models/User';



  export async function POST(req:any){

    await mongoose.connect(process.env.MONGO_URI);

   
    const {id} =await req.json();

    if (!id) {
        return Response.json( 'User ID is required' );
    }
   
    const conversations = await Conversation.find({
        userIds: id
    })
    .sort({ lastMessageAt: 'desc' })
    .populate({
        path: 'users',
        model: User
    })
    .populate({
        path: 'messages',
        model: Message,
        populate: {
            path: 'sender seen',
            model: User
        }
    });

   return  Response.json({ conversations });
     
  }

  