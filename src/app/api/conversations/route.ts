import mongoose from 'mongoose';
import UserProfile from '@/models/Profile'
import { getCurrentUser } from '@/app/lib/auth';

  export async function POST(req:any){

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

   await mongoose.connect(process.env.MONGO_URI);
   
    
    return Response.json('ok');
     
  }

  