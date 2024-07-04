// mongooseSchema.ts
import mongoose, { Document, Schema, model, Types, Model } from 'mongoose';
import { IConversation } from './Conversation'; 
import { IMessage } from './Message'; 

// Interface for Account
interface IAccount extends Document {
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

// Interface for Session
interface ISession extends Document {
  sessionToken: string;
  userId: Types.ObjectId;
  expires: Date;
}

// Interface for User
export interface IUser extends Document {
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  passwordResetToken?: string;
  passwordResetTokenExp?: Date;
  accounts: Types.Array<IAccount>;
  sessions: Types.Array<ISession>;
  conversationIds: mongoose.Types.ObjectId[];
  conversations: IConversation[];

  seenMessageIds: mongoose.Types.ObjectId[];
  seenMessages: IMessage[];
  

  messages: IMessage[];
}

// Interface for VerificationToken
interface IVerificationToken extends Document {
  identifier: string;
  token: string;
  expires: Date;
}

// Account Schema
const accountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: { type: String },
  access_token: { type: String },
  expires_at: { type: Number },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  session_state: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

// Session Schema
const sessionSchema = new Schema<ISession>({
  sessionToken: { type: String, unique: true, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expires: { type: Date, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// User Schema
const userSchema = new Schema<IUser>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: { type: String },
  passwordResetToken: { type: String, unique: true, sparse: true },
  passwordResetTokenExp: { type: Date },
  conversationIds: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
  conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],

  seenMessageIds: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  seenMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],



  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for accounts and sessions
userSchema.virtual('accounts', {
  ref: 'Account',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

userSchema.virtual('sessions', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

// VerificationToken Schema
const verificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

verificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

// Models
const Account: Model<IAccount> = mongoose.models.Account || model<IAccount>('Account', accountSchema);
const Session: Model<ISession> = mongoose.models.Session || model<ISession>('Session', sessionSchema);
const User: Model<IUser> = mongoose.models.User || model<IUser>('User', userSchema);
const VerificationToken: Model<IVerificationToken> = mongoose.models.VerificationToken || model<IVerificationToken>('VerificationToken', verificationTokenSchema);

export {
  Account,
  Session,
  User,
  VerificationToken,
   
};
