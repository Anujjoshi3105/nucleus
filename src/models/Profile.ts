import mongoose, { Document, Schema } from 'mongoose';
import { User } from '@/models/User';

export interface UserProfile extends Document {
  name: string;
  college: string;
  about: string;
  skills: string[];
  experience: string[];
  education: string[];
  certificates: string[];
  achievements: string[];
  links: string[];
  useremail: string;
  user: Schema.Types.ObjectId;
  friends: Schema.Types.ObjectId[];
}

const userProfileSchema = new Schema<UserProfile>({
  name: { type: String, required: true },
  college: { type: String, required: true },
  about: { type: String, required: true },
  skills: [{ type: String }],
  experience: [{ type: String }],
  education: [{ type: String}],
  certificates: [{ type: String }],
  achievements: [{ type: String }],
  links: [{ type: String}],
  useremail: { type: String, ref: 'User', required: true, unique: true }, // Unique reference to the user by email
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Unique reference to the user
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Removed unique constraint
});

// Create and export the model
export default mongoose.models.UserProfile || mongoose.model<UserProfile>('UserProfile', userProfileSchema);
