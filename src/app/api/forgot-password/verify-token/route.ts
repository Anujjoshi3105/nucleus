import mongoose from "mongoose";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  const { token } = body;

  if (!token) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  await mongoose.connect(process.env.MONGO_URI || "");

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExp: { $gte: new Date() },
  });

  if (!user) {
    return new NextResponse("Invalid Token or Token Expired", { status: 400 });
  }

  return NextResponse.json(user);
};
