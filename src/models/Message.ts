import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@/models/User'; 
import Converstion from '@/models/Conversation'; 

export interface IMessage extends Document {
  body?: string;
  image?: string;
  createdAt: Date;
  seenIds: mongoose.Schema.Types.ObjectId[];
  seen: mongoose.Schema.Types.ObjectId[];
  conversationId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>({
  body: { type: String, required: false },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  seenIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  seen: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

messageSchema.pre('findOneAndDelete', async function(next) {
    const message = this as any; // Type assertion to any, because `this` in a query middleware is a query object.
    const doc = await message.model.findOne(this.getFilter());
    
    if (doc) {
      await message.model('Conversation').updateOne(
        { _id: doc.conversationId },
        { $pull: { messageIds: doc._id } }
      );
      await message.model('User').updateMany(
        { _id: { $in: doc.seenIds } },
        { $pull: { seenMessageIds: doc._id } }
      );
    }
    next();
  });


export default mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
