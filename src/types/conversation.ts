// types/conversation.ts
import { Document } from 'mongoose';
import { IUser } from '@/models/User';
import { IMessage } from '@/models/Message';
import { IConversation } from '@/models/Conversation';

export type FullMessageType = IMessage & {
  sender: IUser;
  seen: IUser[];
};

export type FullConversationType = IConversation & {
  users: IUser[];
  messages: FullMessageType[];
};
