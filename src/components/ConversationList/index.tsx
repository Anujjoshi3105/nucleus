// "use client";

// import { FullConversationType } from '@/types/conversation';
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import useConversation from '@/app/hooks/useConversation';
// import clsx from 'clsx';
// import { MdOutlineGroupAdd } from "react-icons/md";
// import ConversationBox from '../ConversationBox';
// import { useSession } from 'next-auth/react';
// import GroupChatModal from '../GroupChatModal';
// import { pusherClient } from '@/app/lib/pusher';
// import { find, update } from 'lodash';

// interface ConversationListProps {
//   initialItems: FullConversationType[];
// }

// interface Friend {
//   id: string;
//   name: string;
// }

// const ConversationList: React.FC<ConversationListProps> = () => {
//   const [items, setItems] = useState<FullConversationType[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { conversationId, isOpen } = useConversation();
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [friends, setFriends] = useState<Friend[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const userId = useMemo(() => session?.user?.id, [session]);

//   const fetchFriends = useCallback(async () => {
//     if (status === 'loading') return;

//     if (!session) {
//       router.push('/signin');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch('/api/chatfriends', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id: userId }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch friends');
//       }

//       const data = await response.json();
//       setFriends(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [session, status, router, userId]);

//   useEffect(() => {
//     fetchFriends();
//   }, [fetchFriends]);

//   const fetchConversations = useCallback(async () => {
//     if (status === 'loading') return;

//     if (!session) {
//       router.push('/signin');
//       return;
//     }

//     if (userId) {
//       const response = await fetch('/api/getconversations', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ sessionId: userId }),
//       });

//       if (response.ok) {
//         const { conversations } = await response.json();
//         console.log("Fetched conversations:", conversations);
//         setItems(conversations);
//       } else {
//         console.error('Failed to fetch conversations');
//       }
//     }
//   }, [session, status, router, userId]);

//   useEffect(() => {
//     fetchConversations();
//   }, [fetchConversations]);

//   const pusherKey =useMemo(()=>{
//       return session?.user?.email;
//   },[session?.user?.email]);
 

//   useEffect(()=>{
//     if(!pusherKey){
//       return;
//     }
//     pusherClient.subscribe(pusherKey);
   
//     const newHandler=(conversation:FullConversationType)=>{
//         setItems((current)=>{
//           if(find(current,{id:conversation.id})){
//             return current
//           }
//           return  [conversation ,...current];
//         })
//     }
// const updateHandler=()=>{
//   setItems((current)=>current.map((currentconversation)=>{
//     if(currentconversation.id=== conversation.id){
//        return {
//         ...currentconversation,
//        messages:conversation.messages
//        }
//     }
//     return currentconversation;
//   }))
// }
//     pusherClient.bind('conversation:new',newHandler)
//     pusherClient.bind('conversation:update', updateHandler);
    

//     return()=>{
//      pusherClient.unsubscribe(pusherKey);
//      pusherClient.unbind('conversation:new',newHandler);
//      pusherClient.unbind('conversation:update',updateHandler)
//     }
//   },[pusherKey]);


//   return (
//     <>
//       <GroupChatModal
//         users={friends}
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//       <aside className={clsx(`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`, isOpen ? 'hidden' : 'block w-full left-0')}>
//         <div className='px-5 pt-32'>
//           <div className='flex justify-between mb-4 pt-4'>
//             <div className='text-2xl font-bold text-neutral-800'>
//               Messages
//             </div>
//             <div onClick={() => setIsModalOpen(true)} className='rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition'>
//               <MdOutlineGroupAdd size={20} />
//             </div>
//           </div>
//           {Array.isArray(items) && items.map((item) => (
//             <ConversationBox
//               key={item.id}
//               data={item}
//               selected={conversationId === item.id}
//             />
//           ))}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default ConversationList;


"use client";

import { FullConversationType } from '@/types/conversation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useConversation from '@/app/hooks/useConversation';
import clsx from 'clsx';
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from '../ConversationBox';
import { useSession } from 'next-auth/react';
import GroupChatModal from '../GroupChatModal';
import { pusherClient } from '@/app/lib/pusher';
import { find, update } from 'lodash';

interface ConversationListProps {
  
}

interface Friend {
  id: string;
  name: string;
}

const ConversationList: React.FC<ConversationListProps> = () => {
  const [items, setItems] = useState<FullConversationType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversationId, isOpen } = useConversation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useMemo(() => (session?.user as any).id, [session]);

  const fetchFriends = useCallback(async () => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/signin');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/chatfriends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      const data = await response.json();
      setFriends(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session, status, router, userId]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const fetchConversations = useCallback(async () => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/signin');
      return;
    }

    if (userId) {
      const response = await fetch('/api/getconversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: userId }),
      });

      if (response.ok) {
        const { conversations } = await response.json();
        console.log("Fetched conversations:", conversations);
        setItems(conversations);
      } else {
        console.error('Failed to fetch conversations');
      }
    }
  }, [session, status, router, userId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const pusherKey = useMemo(() => {
    return session?.user?.email;
  }, [session?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            } as FullConversationType;
          }
          return currentConversation;
        })
      );
    };


    const removeHandler=(conversation:FullConversationType)=>{
       setItems((current)=>{
        return[...current.filter((convo)=>convo.id !== conversation.id)]
       })
    }

    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:remove',removeHandler);

    return () => {

      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new', newHandler);
      pusherClient.unbind('conversation:update', updateHandler);
      pusherClient.unbind('conversation:remove',removeHandler);

    };
  }, [pusherKey]);

  return (
    <>
      <GroupChatModal
        users={friends}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside className={clsx(`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`, isOpen ? 'hidden' : 'block w-full left-0')}>
        <div className='px-5 pt-32'>
          <div className='flex justify-between mb-4 pt-4'>
            <div className='text-2xl font-bold text-neutral-800'>
              Messages
            </div>
            <div onClick={() => setIsModalOpen(true)} className='rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition'>
              <MdOutlineGroupAdd size={20} />
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
    </>
  );
};

export default ConversationList;

