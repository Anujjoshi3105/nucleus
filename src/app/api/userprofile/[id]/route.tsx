import mongoose from 'mongoose';
import UserProfile from '@/models/Profile'
import { NextRequest } from 'next/server';


    export async function GET(req: NextRequest, { params }: { params: { id: string }} ){
    const { id } = params;
   await mongoose.connect(process.env.MONGO_URI);
   const profile = await UserProfile.findOne({ user: id });
   
   return Response.json(profile);
  }
