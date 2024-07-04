import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User'; // Adjust the import path as needed
import { IMessage } from './Message'; // Adjust the import path as needed

export interface IConversation extends Document {
  createdAt: Date;
  lastMessageAt: Date;
  name?: string;
  isGroup?: boolean;
  messageIds: mongoose.Types.ObjectId[];
  messages: IMessage[];
  userIds: mongoose.Types.ObjectId[];
  users: IUser[];
}

const conversationSchema = new Schema<IConversation>({
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now },
  name: { type: String },
  isGroup: { type: Boolean },
  messageIds: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);
