import mongoose from 'mongoose';
import UserProfile from '@/models/Profile'
import { getCurrentUser } from '@/app/lib/auth';
import Conversation from '@/models/Converstion';

  export async function POST(req:any){

    await mongoose.connect(process.env.MONGO_URI);

    const currentUser = await getCurrentUser(req);
    
    if (!currentUser?.id || !currentUser?.email) {
      return Response.json({ message: 'Unauthorized' });
    }
    const body =await req.json();

    const {
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
        const newConversation = await Conversation.create({
          data: {
            name, 
            isGroup,
            users: {
              connect: [
                ...members.map((member: { value: string }) => ({ id: member.value })),
                { id: currentUser.id }
              ]
            }
          },
          include:{
            users:true,
          }
        });

        return Response.json(newConversation);
      }
      
      const existingConversations = await Conversation.findMany({
          where:{
            OR:[
              {
                userIds:{
                  equals:[currentUser.id ,userId]
                }

              },
              {
                userIds:{
                  equals:[userId,currentUser.id]
                },
              }
            ]
          }
      });

      const singleConversation =existingConversations[0];

      if(singleConversation){
        return Response.json(singleConversation);
      }

      const newConversation = await Conversation.create({
          data:{
            users:{
              connect:[
                {
                  id :currentUser.id
                },
                {
                 id:userId
                }
              ]
            }
          },
          include:{
            users:true
          }
      });

      return Response.json(newConversation);

  
   
    
    return Response.json('ok');
     
  }

  