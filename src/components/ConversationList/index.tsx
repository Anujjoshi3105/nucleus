"use client"


import { FullConversationType } from '@/types/conversation';
import React from 'react'
import { useRouter} from 'next/navigation';
import { useState } from 'react';
import useConversation from '@/app/hooks/useConversation';
import clsx from 'clsx';
import {MdOutlineGroupAdd} from "react-icons/md";
import ConversationBox from '../ConversationBox';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface ConversationListProps{
  initialItems: FullConversationType[];
}

const ConversationList:React.FC <ConversationListProps> = () => {

  const [items, setItems] = useState<FullConversationType[]>([]);
 
  const {conversationId,isOpen} = useConversation();
  const { data: session, status } = useSession();
  const router =useRouter();
  

  useEffect(() => {
    const fetchConversations = async () => {

      if (status === 'loading') return;

    if (!session) {
      router.push('/signin');
      return;
    }

    const userId = session.user?.id;


      if (userId) {
        const response = await fetch('/api/getconversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId:userId }),
        });

        if (response.ok) {
          const { conversations } = await response.json();
          console.log("Fetched conversations:", conversations); // Add this line
          setItems(conversations);
        } else {
          console.error('Failed to fetch conversations');
        }
      }
    };

    fetchConversations();
  }, [session]);


  return (
    <aside className={clsx(`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,isOpen ?'hidden':'block w-full left-0')}>
       <div className='px-5 pt-32'>
      <div className='flex justify-between mb-4 pt-4'>
         <div className='text-2xl font-bold text-neutral-800'>
          Messages
         </div>
         <div className='rounded-full  p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition'>
          <MdOutlineGroupAdd size={20}/>
         </div>
      </div>
      {Array.isArray(items) && items.map((item) => (
          <ConversationBox
            key={item.id}
            data={item}
            selected={conversationId === item.id}
          />
        ))}
       </div>
    </aside>
  )
}

export default ConversationList;