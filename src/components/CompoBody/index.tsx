import React, { useRef, useState } from 'react'
import { FullMessageType } from '@/types/conversation'
import useConversation from '@/app/hooks/useConversation';
import MessageBox from '../MessageBox';

interface BodyProps{
   initialMessages :FullMessageType[]
}


const CompoBody:React.FC<BodyProps> = ({
    initialMessages
}) => {
    const [messages,setMessages] =useState(initialMessages);
    const bottomRef =useRef<HTMLDivElement>(null);
    

    const {conversationId} =useConversation();



  return (
    <div className='felx-1 overflow-y-auto'>
        {messages.map((message ,i)=>(
            <MessageBox
             isLast ={i===messages.length-1}
             key= {message.id}
             data={message}
             />
        ))}
        
       <div ref={bottomRef} className='pt-24'>

       </div>
        </div>
  )
}

export default CompoBody