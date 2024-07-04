import mongoose, { Schema, Document } from 'mongoose';
import {IUser} from './User' // Adjust the import path as needed
import { IConversation } from './Conversation'; // Adjust the import path as needed

export interface IMessage extends Document {
  body?: string;
  image?: string;
  createdAt: Date;
  seenIds: mongoose.Types.ObjectId[];
  seen: IUser[];
  conversationId: mongoose.Types.ObjectId;
  conversation: IConversation;
  senderId: mongoose.Types.ObjectId;
  sender: IUser;
}

const messageSchema = new Schema<IMessage>({
  body: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  seenIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  seen: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
