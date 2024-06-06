import mongoose, { Document, Schema } from 'mongoose';
import {User} from '@/models/User'

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
}

const userProfileSchema = new Schema<UserProfile>({
  name: { type: String, required: true },
  college: { type: String, required: true },
  about: { type: String, required: true },
  skills: [{ type: String, required: true }],
  experience: [{ type: String, required: true }],
  education: [{ type: String, required: true }],
  certificates: [{ type: String, required: true }],
  achievements: [{ type: String, required: true }],
  links: [{ type: String, required: true }],
  useremail: { type: String, ref: 'User', required: true }, // Reference to the user by email
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
});

// Create and export the model
export default mongoose.models.UserProfile || mongoose.model<UserProfile>('UserProfile', userProfileSchema);