import mongoose from 'mongoose';
import UserProfile from '@/models/Profile'


  export async function GET(req:any){
    

   await mongoose.connect(process.env.MONGO_URI);
   const profiles = await UserProfile.find({});
   return Response.json(profiles);
     
  }

  