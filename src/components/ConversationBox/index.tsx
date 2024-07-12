"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { FullConversationType } from '@/types/conversation';
import Avatara from '../Avatara';
import { format } from 'date-fns';

interface ConversationBoxProps { 
   data: FullConversationType;
   selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  const [otherUserName, setOtherUserName] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();


   
  useEffect(() => {

    if (!session) {
      router.push('/signin');
      return;
    }


    const fetchOtherUserName = async () => {
      const response = await fetch('/api/getOtherUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId: data._id, sessionUserId: session?.user?.id }),
      });

      if (response.ok) {
        const { name } = await response.json();
        setOtherUserName(name);
      } else {
        console.error('Failed to fetch other user name');
      }
    };

    if (session?.user?.id) {
      fetchOtherUserName();
    } 
    
  }, [data._id, session?.user?.id]);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data._id}`);
  }, [data._id, router]);

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
        <p  className='text-md font-medium text-gray-900'>
       {data.name || otherUserName}
        </p>
        {lastMessage?.createdAt &&(
          <p className='text-xs text-gray-400 font-light'>
            {format(new Date(lastMessage.createdAt),'p')}
          </p>
        )}
      </div>
      <p className={clsx(`truncate text-sm`, hasSeen?'text-gray-500': 'text-black font-medium' )}>
        {lastMessageText}
      </p>
    </div>
    </div>
   </div>
  );
}

export default ConversationBox;








// "use client";

// import React, { useCallback, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { format } from 'date-fns';
// import { useSession } from 'next-auth/react';
// import clsx from 'clsx';
// import { FullConversationType } from '@/types/conversation';
// import useOtherUser from '@/app/hooks/useOtherUser';
// import Avatara from '../Avatara';
// import { useState } from 'react';
// import { useEffect } from 'react';

// interface ConversationBoxProps { 
//    data: FullConversationType,
//    selected?: boolean;
// }

// const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
//   const [otherUserName, setOtherUserName] = useState<string | null>(null);
//   const { data: session } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOtherUserName = async () => {
//       const response = await fetch('/api/getOtherUser', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ conversationId: data._id, sessionUserId: session?.user?.id }),
//       });

//       if (response.ok) {
//         const { name } = await response.json();
//         setOtherUserName(name);
//       } else {
//         console.error('Failed to fetch other user name');
//       }
//     };

//     fetchOtherUserName();
//   }, [data._id, session?.user?.id]);



//   const handleClick = useCallback(() => {
//     router.push(`/conversations/${data.id}`);
//   }, [data.id, router]);

//   const lastMessage = useMemo(() => {
//     const messages = data.messages || [];
//     return messages[messages.length - 1];
//   }, [data.messages]);

//   const userEmail = useMemo(() => {
//     return session?.user?.email;
//   }, [session?.user?.email]);

//   const hasSeen = useMemo(() => {
//     if (!lastMessage) return false;

//     const seenArray = lastMessage.seen || [];
//     if (!userEmail) return false;

//     return seenArray.some((user) => user.email === userEmail);
//   }, [userEmail, lastMessage]);

//   const lastMessageText = useMemo(() => {
//     if (lastMessage?.image) return 'Sent an Image';
//     if (lastMessage?.body) return lastMessage.body;
//     return 'Started a Conversation';
//   }, [lastMessage]);

//   return (
//    <div onClick={handleClick} className={clsx(`w-full p-3 relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer`,selected ? 'bg-neutral-100': 'bg-white')}>
//     <Avatara/>
//     <div className='min-w-0 flex-1'>
//     <div className='focus:outline-none'>
//       <div className='flex justify-between items-center mb-1'>
//         <p >
//        {data.name || otherUserName}
//         </p>
//       </div>
//     </div>
//     </div>
//    </div>
//   );
// }

// export default ConversationBox;
{/* <div onClick={handleClick} className={clsx(`w-full p-3 relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer`,selected ? 'bg-neutral-100': 'bg-white')}>
    <Avatara/>
    <div className='min-w-0 flex-1'>
    <div className='focus:outline-none'>
      <div className='flex justify-between items-center mb-1'>
        <p >
       {data.name || otherUserName}
        </p>
      </div>
    </div>
    </div>
   </div> */}