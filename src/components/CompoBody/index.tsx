import React, { useRef, useState, useEffect } from 'react';
import { FullMessageType } from '@/types/conversation';
import useConversation from '@/app/hooks/useConversation';
import MessageBox from '../MessageBox';
import { IMessage } from '@/models/Message';

interface BodyProps {
  initialMessages: FullMessageType[];
}

const CompoBody: React.FC<BodyProps> = ({ initialMessages }) => {

  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

 
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
