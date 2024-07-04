import mongoose from 'mongoose';
import UserProfile from '@/models/Profile'


  export async function POST(req:any){
    const {friendId} =await req.json();

    if (!friendId) {
        return Response.json('friend ID is required' );
      }

   await mongoose.connect(process.env.MONGO_URI);

   const profile = await UserProfile.findById(friendId);


   if (!profile) {
    return Response.json( 'Profile not found' );
  }


  return Response.json({ userId: profile.user });
     
  }

  