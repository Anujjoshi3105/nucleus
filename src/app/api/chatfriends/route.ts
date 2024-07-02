import mongoose from 'mongoose';
import UserProfile from '@/models/Profile'
import { getSession } from 'next-auth/react';

  export async function POST(req:any){
    
      const {id} =await req.json();

      if (!id || typeof id !== 'string') {
        return Response.json({ message: 'User ID is required' });
      }
   
     await mongoose.connect(process.env.MONGO_URI);

     const userProfile = await UserProfile.findOne({ user: id });
     
     if (!userProfile) {
        return Response.json({ message: 'UserProfile not found' });
      }
  
      // Get the list of friends' IDs
      const friendsIds = userProfile.friends;

      if (!Array.isArray(friendsIds)) {
        return Response.json({ message: 'Friends is not an array' });
      }
  
  
      // Find the profiles of each friend using the IDs in the friends array
      const friendsProfiles = await UserProfile.find({ user: { $in: friendsIds } });
  
      // Extract friend names
      const friendNames = friendsProfiles.map(friend => ({
        id: friend._id,
        name: friend.name,
      }));
  

       return Response.json(friendNames);
     
  }


