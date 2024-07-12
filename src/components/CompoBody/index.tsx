"use client"

import React, { useRef, useState, useEffect } from 'react';
import { FullMessageType } from '@/types/conversation';
import useConversation from '@/app/hooks/useConversation';
import MessageBox from '../MessageBox';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface BodyProps {
  initialMessages: FullMessageType[];
}

const CompoBody: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();
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

  useEffect(() => {
    if (conversationId && session?.user?.id) {
      fetch(`/api/conversation/${conversationId}/seen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currUserId: session.user.id }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Seen status updated:', data);
      })
      .catch(error => {
        console.error('Error updating seen status:', error);
      });
    }
  }, [conversationId, session]);

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
