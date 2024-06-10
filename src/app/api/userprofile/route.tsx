import mongoose from 'mongoose';
import UserProfile from '@/models/Profile'


  export async function POST(req:any){
    const body =await req.json();
   await mongoose.connect(process.env.MONGO_URI);
    const cretedprofile =await UserProfile.create(body);
    return Response.json(cretedprofile);
     
  }

  