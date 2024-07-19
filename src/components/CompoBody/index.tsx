"use client"

import React, { useRef, useState, useEffect } from 'react';
import { FullMessageType } from '@/types/conversation';
import useConversation from '@/app/hooks/useConversation';
import MessageBox from '../MessageBox';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/app/lib/pusher';
import { find, update } from 'lodash';

interface BodyProps {
  initialMessages: FullMessageType[];
}

const CompoBody: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId} = useConversation();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    console.log('Initial Messages in CompoBody:', initialMessages);
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(()=>{
    const conversationIdString = conversationId.toString();
    pusherClient.subscribe(conversationIdString);
     bottomRef?.current?.scrollIntoView();

     const messageHandler =(message:FullMessageType)=>{

        setMessages((current)=>{
          if(find(current ,{id:message.id})){
            return current;
          }
          return [...current, message]
        });
        bottomRef?.current?.scrollIntoView();
       
     }

     const updateMessageHandler=()=>{

     }

     pusherClient.bind('messages:new',messageHandler);
     pusherClient.bind('message:update',updateMessageHandler)

     return()=>{
      const conversationIdString = conversationId.toString();
      pusherClient.unsubscribe(conversationIdString);
      pusherClient.unbind('messages:new',messageHandler);

      pusherClient.unbind('message:Update',updateMessageHandler)
     }

  },[conversationId]);


 

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className='pt-24' />
    </div>
  );
};

export default CompoBody;
