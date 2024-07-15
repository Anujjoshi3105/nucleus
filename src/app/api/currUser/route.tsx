import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/models/User';

export async function POST(req: any) {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    
    const { userId } = await req.json();

    if (!userId) {
      return Response.json(  'User ID is required' );
    }

    
    const currentUser = await User.findById(userId).exec();
    

    if (!currentUser) {
      return Response.json(  'User not found' );
    }

   
    return Response.json(currentUser);

  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
