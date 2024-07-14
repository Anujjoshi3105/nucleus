// "use client"

// import React, { Children, useCallback, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import useConversation from '@/app/hooks/useConversation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Modal from '../Modal';
// import{ FiAlertTriangle} from 'react-icons/fi'
// import { Dialog, Transition } from '@headlessui/react'

// interface ConfirmModalProps{
//     isOpen?:boolean,
//     onClose :()=>void,
   
// }

// const ComfirmModal:React.FC<ConfirmModalProps> = ({
//     isOpen ,onClose
// }) => {

// const router =useRouter();
// const {conversationId} =useConversation();
// const[isLoding ,setIsloding] =useState(false);

// const onDelete =useCallback(()=>{
//     setIsloding(true);
//     axios.delete(`/api/conversation/${conversationId}`)
//     .then(()=>{
//         onClose();
//         router.push('/conversations');
//         router.refresh();
//     })
//     .catch(()=>toast.error('Something went wrong'))
//     .finally(()=>setIsloding(false));

// },[conversationId ,router ,onClose]);

//   return (
//    <Modal isOpen={isOpen} onClose={onClose} >
//      <div className='sm:flex sm:items-start'>
//          <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
//              <FiAlertTriangle className='h-6 w-6 text-red-600'/>

//          </div>
//          <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
//              <Dialog.Title as='h3' className='text-base font-semibold leading-6 text-gray-900'>
//                  Delete Conversation
//              </Dialog.Title>
//              <div className='mt-2'>
//               <p className='text-sm text-gray-500'>
//               Are you sure you want to Delete the Conversation ? This action cannot be undone.
//               </p>
//              </div>
//          </div>
//      </div>
//      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
//      <button
//   type='button'
//   disabled={isLoding}
//   onClick={onDelete}
//   className={`px-4 py-2 border rounded-lg font-semibold transition-colors duration-200 ${
//     isLoding ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
//   }`}
// >
//   Delete
// </button>
// <button
//   type='button'
//   disabled={isLoding}
//   onClick={onClose}
//   className={`ml-2 px-4 py-2 border rounded-lg font-semibold transition-colors duration-200 ${
//     isLoding ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
//   }`}
// >
//   Cancel
// </button>
 

//      </div>
//    </Modal>
//   )
// }

// export default ComfirmModal


"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { FiAlertTriangle } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import { useSession } from 'next-auth/react';

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {



  const router = useRouter();
  const { data: session } = useSession();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    if (!session) {
      router.push('/signin');
    }
  }, [session, router]);



  const onDelete = useCallback(() => {
    if (!session) return;

    setIsLoading(true);
    fetch(`/api/conversation/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: session.user?.id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        onClose();
        router.push('/conversations');
        router.refresh();
      })
      .catch(() => toast.error('Something went wrong'))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose, session]);

  if (!session) return null;
  


return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='sm:flex sm:items-start'>
        <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
          <FiAlertTriangle className='h-6 w-6 text-red-600' />
        </div>
        <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
          <Dialog.Title as='h3' className='text-base font-semibold leading-6 text-gray-900'>
            Delete Conversation
          </Dialog.Title>
          <div className='mt-2'>
            <p className='text-sm text-gray-500'>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
        <button
          type='button'
          disabled={isLoading}
          onClick={onDelete}
          className={`px-4 py-2 border rounded-lg font-semibold transition-colors duration-200 ${
            isLoading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
          }`}
        >
          Delete
        </button>
        <button
          type='button'
          disabled={isLoading}
          onClick={onClose}
          className={`ml-2 px-4 py-2 border rounded-lg font-semibold transition-colors duration-200 ${
            isLoading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
          }`}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
