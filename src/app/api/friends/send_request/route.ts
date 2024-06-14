import mongoose from 'mongoose';
import { User } from '@/models/User';
import Profile from '@/models/Profile';
import Notification from '@/models/Notification';

  export async function POST(req:any){
    const { senderId, receiverId } = await req.json();

   await mongoose.connect(process.env.MONGO_URI);

   console.log('Connecting to the database');
   console.log(`Sender ID: ${senderId}`);
   console.log(`Receiver ID: ${receiverId}`);

   const senderProfile = await Profile.findOne({ user: senderId });
      const receiverProfile = await Profile.findOne({ user: receiverId });

   if (!senderProfile) {
    return Response.json(  'Sender profile not found' );
  }

   if (!receiverProfile) {
    return Response.json( 'Receiver profile not found' );
  }

  const notificationMessage = `${senderProfile.name} wants to connect with you.`;

  // Create a notification entry in the database
  const notification = new Notification({
    receiverId,
    senderId,
    message: notificationMessage,
    date: new Date(), // Adding a date field
  });

  await notification.save();


return Response.json({ message: notificationMessage });
 
  }

