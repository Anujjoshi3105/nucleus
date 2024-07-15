import mongoose from "mongoose";
import Notification from "@/models/Notification";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await mongoose.connect(process.env.MONGO_URI || "");

  const notification = await Notification.find({ receiverId: id })
    .sort({ createdAt: -1 })
    .populate("senderId", "name")
    .exec();

  return new Response(JSON.stringify(notification), { status: 200 });
}

export async function DELETE(req: any) {
  try {
    const { id, notificationId } = req.params;

    await mongoose.connect(process.env.MONGO_URI || "");

    await Notification.findByIdAndDelete(notificationId);

    return new Response("Notification deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
