"use client";

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { FullConversationType } from '@/types/conversation';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatara from '../Avatara';

interface ConversationBoxProps { 
   data: FullConversationType,
   selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session?.user?.email;
  }, [session?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    const seenArray = lastMessage.seen || [];
    if (!userEmail) return false;

    return seenArray.some((user) => user.email === userEmail);
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return 'Sent an Image';
    if (lastMessage?.body) return lastMessage.body;
    return 'Started a Conversation';
  }, [lastMessage]);

  return (
   <div onClick={handleClick} className={clsx(`w-full p-3 relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer`,selected ? 'bg-neutral-100': 'bg-white')}>
    <Avatara/>
    <div className='min-w-0 flex-1'>
    <div className='focus:outline-none'>
      <div className='flex justify-between items-center mb-1'>
        <p >
       {data.name || otherUser?.name}
        </p>
      </div>
    </div>
    </div>
   </div>
  );
}

export default ConversationBox;
