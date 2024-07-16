import mongoose from "mongoose";
import UserProfile from "@/models/Profile";
import Conversation from "@/models/Conversation";
import { Types } from "mongoose";
import { User } from "@/models/User";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: any) {
  await mongoose.connect(process.env.MONGO_URI || "");

  const body = await req.json();

  const { currentUserId, userId, isGroup, members, name } = body;

  
 
  if (isGroup && (!members || members.length < 2 || !name)) {
    return Response.json("Invalid group Data");
  }

  if (isGroup) {
    const newConversation = new Conversation({
      name,
      isGroup,
      userIds: [
        ...members.map((member: { value: { id: string } }) => member.value.id),
        currentUserId,
      ],
    });

    await newConversation.save();
    await newConversation.populate("users", "name email");

    for (const userId of newConversation.userIds) {
      const user = await User.findById(userId);
      if (user?.email) {
        await pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    }

    return Response.json(newConversation);
  }

  const existingConversation = await Conversation.findOne({
    $or: [
      { userIds: { $all: [currentUserId, userId] } },
      { userIds: { $all: [userId, currentUserId] } },
    ],
  })
    .populate("users", "name email")
    .exec();

  // const singleConversation =existingConversations[0];

  if (existingConversation) {
    return Response.json(existingConversation);
  }

  const newConversation = new Conversation({
    userIds: [currentUserId, userId],
  });

  await newConversation.save();
  await newConversation.populate("users", "name email");

  for (const userId of newConversation.userIds) {
    const user = await User.findById(userId);
    if (user?.email) {
      await pusherServer.trigger(user.email, "conversation:new", newConversation);
    }
  }

  return Response.json(newConversation);
}

