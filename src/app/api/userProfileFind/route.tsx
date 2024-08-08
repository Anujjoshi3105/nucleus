import mongoose from "mongoose";
import UserProfile from "@/models/Profile";

export async function POST(req: any) {
  const { value } = await req.json();

  if (!value) {
    return Response.json("Value is required");
  }

  await mongoose.connect(process.env.MONGO_URI || "");

  const profile = await UserProfile.findById(value);

  if (!profile) {
    return Response.json("Profile not found");
  }

  return Response.json({ id: profile.user });
}

