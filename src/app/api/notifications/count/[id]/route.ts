import mongoose from 'mongoose';
import { NextRequest, Response } from 'next/server';
import Notification from '@/models/Notification'; 
export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const { id } = params;

  try {
    await mongoose.connect(process.env.MONGO_URI); 

    const count = await Notification.countDocuments({
      receiverId:  new mongoose.Types.ObjectId(id), 
      status: 'pending',
    });


    return Response.json({ count }); 
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return Response.error(500, 'Internal Server Error');
  }
}
