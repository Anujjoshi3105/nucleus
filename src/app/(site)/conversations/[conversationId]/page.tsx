"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import EmptyState from '@/components/EmptyState';
import ConversationHeader from '@/components/ConversationHeader';
import CompoBody from '@/components/CompoBody';
import CompoForm from '@/components/CompoForm';
interface IParams {
  conversationId: string;
}

interface Message {
  _id: string;
  body?: string;
  image?: string;
  createdAt: Date;
  seen: { name: string }[];
  sender: { name: string };
}

const ConversationId: React.FC<{ params: IParams }> = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        const response = await fetch('/api/getConversationById', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversationId: params.conversationId, sessionUserId: session?.user?.id }),
        });

        if (response.ok) {
          const data = await response.json();
          setConversation(data);
        } else {
          console.error('Failed to fetch conversation');
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/getMessagesByConversationId', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversationId: params.conversationId }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchConversationData();
    fetchMessages();
  }, [params.conversationId, session?.user?.id]);

  if (!conversation) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
          <div className='px-4 pt-96 pb-96 sm:px-6 lg:px-8 flex justify-center items-center bg-gray-300'>
            <div className='text-center items-center flex flex-col'>
              <h3 className='mt-2 text-2xl font-semibold text-gray-900'>Select a chat or start a new conversation</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='lg:pl-80 h-full'>
      <div className='h-full flex flex-col'>
        <ConversationHeader conversation={conversation} />
       <CompoBody/>
       <CompoForm/>
      </div>
    </div>
  );
};

export default ConversationId;
