import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Notification from "@/models/Notification";
import Profile from "@/models/Profile";
import { NextRequest } from "next/server";

export async function POST(req: any) {
  const { notificationId } = await req.json();

  if (!notificationId) {
    return Response.json({
      message: "Notification ID is required in the request body",
    });
  }

  await mongoose.connect(process.env.MONGO_URI || "");

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return Response.json("Notification not found");
  }

  if (notification.status !== "pending") {
    return Response.json("Notification already processed");
  }
  const receiverProfile = await Profile.findOne({
    user: notification.receiverId,
  });
  const senderProfile = await Profile.findOne({ user: notification.senderId });

  notification.status = "accepted";
  await notification.save();

  // const formattedAcceptanceTime = formatAcceptanceTime(notification.acceptedAt);

  const senderNotification = new Notification({
    receiverId: notification.senderId,
    senderId: notification.receiverId,
    message: `Connection request accepted by ${receiverProfile.name} `,
    status: "accepted",
  });

  await senderNotification.save();

  if (!receiverProfile || !senderProfile) {
    return Response.json({ message: "Profiles not found" });
  }

  receiverProfile.friends.push(notification.senderId);
  senderProfile.friends.push(notification.receiverId);

  await receiverProfile.save();
  await senderProfile.save();

  return Response.json({ message: "Friend request accepted" });

  // function formatAcceptanceTime(acceptedAt: Date): string {
  //   const now = new Date();
  //   const diffMilliseconds = now.getTime() - acceptedAt.getTime();
  //   const diffSeconds = Math.floor(diffMilliseconds / 1000);
  //   const diffMinutes = Math.floor(diffSeconds / 60);
  //   const diffHours = Math.floor(diffMinutes / 60);
  //   const diffDays = Math.floor(diffHours / 24);

  //   if (diffDays > 0) {
  //     return `accepted ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  //   } else if (diffHours > 0) {
  //     return `accepted ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  //   } else if (diffMinutes > 0) {
  //     return `accepted ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  //   } else {
  //     return `accepted just now`;
  //   }
  // }
}
