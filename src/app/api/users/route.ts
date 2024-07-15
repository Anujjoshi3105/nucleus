import mongoose from "mongoose";
import { User } from "@/models/User";

export async function POST(req: any) {

    const { userIds, currentUserId } = await req.json();

  if (!userIds) {
    return Response.json("userIds  is required");
  }
  if(!currentUserId){
    return Response.json("currentuserIds  is required");
  }

  await mongoose.connect(process.env.MONGO_URI || "");

  const users = await User.find({ _id: { $in: userIds } }).select('id name email');

  if (!users) {
    return Response.json("Profile not found");
  }

  return Response.json({ users });
}