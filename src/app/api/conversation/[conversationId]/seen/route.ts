import mongoose from "mongoose";
import UserProfile from "@/models/Profile";
import Conversation from "@/models/Conversation";
import { NextRequest } from "next/server";
import Message from "@/models/Message";
import { pusherServer } from "@/app/lib/pusher";
import { User } from "@/models/User";

export async function POST(
  req: any,
  { params }: { params: { conversationId: string } }
) {
  const { conversationId } = params;
  const { currUserId } = req.json();

  if (!conversationId) {
    return Response.json("conversation Id required");
  }

  await mongoose.connect(process.env.MONGO_URI || "");

  const conversation = await Conversation.findById(conversationId)
    .populate({
      path: "messages",
      populate: { path: "seen" },
    })
    .populate("users");

  if (!conversation) {
    return Response.json("Conversation not found");
  }
  
  const currUser =await User.findById(currUserId);

  const lastMessage = conversation.messages[conversation.messages.length - 1];

  if (!lastMessage) {
    return Response.json(conversation);
  }

  const updatedMessage = await Message.findByIdAndUpdate(
    lastMessage._id,
    { $addToSet: { seen: currUserId } },
    { new: true }
  ).populate("sender seen");

  if (!updatedMessage) {
    return Response.json("Message not found");
  }

  await pusherServer.trigger(currUser?.email,'conversation:update',{
    id:conversationId,
    messages:[updatedMessage]
  });

  if(lastMessage.seenIds.indexOf(currUser?.id)!==-1){
    return Response.json(conversation)
  }

  await pusherServer.trigger(conversationId!,'message:update',updatedMessage)



  return Response.json(updatedMessage);
}
