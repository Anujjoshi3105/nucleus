import mongoose from "mongoose";
import UserProfile from "@/models/Profile";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await mongoose.connect(process.env.MONGO_URI || "");
  const profile = await UserProfile.findById(id);
  return Response.json(profile);
}
