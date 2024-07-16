import mongoose from "mongoose";
import UserProfile from "@/models/Profile";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { User } from "@/models/User";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: any) {
  await mongoose.connect(process.env.MONGO_URI || "");

  const { message, image, conversationId, sessionId } = await req.json();

  const currentUser = await User.findById(sessionId);

  if (!currentUser?.id || !currentUser?.email) {
    return Response.json("Unauthorized");
  }

  // Create a new message
  let newMessage = await Message.create({
    body: message,
    image: image,
    conversation: conversationId,
    sender: currentUser.id,
    seen: [currentUser.id],
  });

  newMessage = await Message.findById(newMessage._id)
    .populate("seen")
    .populate("sender")
    .exec();

  const updatedConversation = await Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessageAt: new Date(),
      $push: { messages: newMessage._id },
    },
    { new: true }
  )
    .populate({
      path: "users",
      select: "name email",
    })
    .populate({
      path: "messages",
      populate: { path: "seen" },
    })
    .exec();

    await pusherServer.trigger(conversationId,'messages:new',newMessage);

  const  lastMessage =updatedConversation.messages[updatedConversation.messages.length-1];

  // updatedConversation.users.map((user) => {
  //   pusherServer.trigger(user.email!, 'conversation:update', {
  //     id: conversationId,
  //     messages: [lastMessage],
  //   });
  // });

  for (const userId of updatedConversation.userIds) {
    const user = await User.findById(userId);
    if (user?.email) {
      await pusherServer.trigger(user.email, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage],
      });
    }
  }
  return Response.json(newMessage);
}
