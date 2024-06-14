import mongoose, { Document, Schema } from 'mongoose';

interface INotification extends Document {
  receiverId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },  
}, {
  timestamps: true, 
});

// Add a TTL index to automatically delete notifications after 1 month 
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); 

// Add a unique compound index on receiverId and senderId
notificationSchema.index({ receiverId: 1, senderId: 1 }, { unique: true });


notificationSchema.pre('save', function(next) {
  if (this.receiverId.toString() === this.senderId.toString()) {
    return next(new Error('Sender and receiver cannot be the same user.'));
  }
  next();
});

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
