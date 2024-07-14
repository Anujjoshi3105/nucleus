import mongoose from 'mongoose';
import UserProfile from '@/models/Profile';
import Conversation from '@/models/Conversation'


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
          userIds: [...members.map((member: { value: string }) => member.value), currentUserId]
        });

        
        await newConversation.save();
        await newConversation.populate('users', 'name email');

        return  Response.json('newconversation');

      }

      const existingConversation = await Conversation.findOne({
        $or: [
          { userIds: { $all: [currentUserId, userId] } },
          { userIds: { $all: [userId, currentUserId] } }
        ]
      }).populate('users', 'name email').exec();


      // const singleConversation =existingConversations[0];

      if(existingConversation){
        
        return Response.json(existingConversation);
      }

      const newConversation = new Conversation({
        userIds: [currentUserId, userId],
      });

      await newConversation.save();
      await newConversation.populate('users', 'name email')

      return Response.json(newConversation);

     
  }

  