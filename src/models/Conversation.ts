import mongoose, { Schema, Document } from 'mongoose';
import Message from '@/models/Message'; // Adjust the import path as needed
import { User } from '@/models/User'; // Adjust the import path as needed

export interface IConversation extends Document {
  createdAt: Date;
  lastMessageAt: Date;
  name?: string;
  isGroup?: boolean;
  messageIds: mongoose.Schema.Types.ObjectId[];
  userIds: mongoose.Schema.Types.ObjectId[];
}

const conversationSchema = new Schema<IConversation>({
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now },
  name: { type: String, required: false },
  isGroup: { type: Boolean, required: false },
  messageIds: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);
