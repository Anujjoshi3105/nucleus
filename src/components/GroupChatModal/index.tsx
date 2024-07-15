"use client"

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';
import { useSession } from 'next-auth/react';
interface Friend {
    id: string;
    name: string;
  }
  
interface GroupChatModalProps{
    isOpen?:boolean,
    onClose: () =>void,
    users:Friend[]

}

const GroupChatModal:React.FC<GroupChatModalProps>= ({
    isOpen ,onClose,users
}) => {

    const router =useRouter();
    const { data: session } = useSession();
    const [isLoading ,setIsLoading] =useState(false);
     
    const {register 
        ,handleSubmit 
        ,setValue 
        ,watch
         ,formState:{
           errors
         }} =useForm<FieldValues>({
        defaultValues:{
            name:'',
            members:[]
        }
    })
    const members  = watch('members')

    // const onSubmit :SubmitHandler<FieldValues>=(data)=>{
    //    setIsLoading(true);
    //    axios.post('api/conversation',{
    //     ...data,
    //     isGroup:true
    //    })
    //    .then(()=>{
    //     router.refresh();
    //     onClose();
    //    })
    //    .catch(()=>toast.error('Something went wrong'))
    //    .finally(()=>setIsLoading(false));

    // }

    // const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    //     setIsLoading(true);


    //     try {
    //         const response = await fetch('/api/conversations', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 ...data,
    //                 isGroup: true

    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to create conversation');
    //         }

    //         router.refresh();
    //         onClose();
    //     } catch (error) {
    //         toast.error('Something went wrong');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
      setIsLoading(true);
      try {
          // Fetch ids for each member
          const updatedMembers = await Promise.all(data.members.map(async (member: any) => {
              const response = await fetch('/api/userProfileFind', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ value: member.value }),
              });
  
              if (!response.ok) {
                  throw new Error('Failed to fetch user profile');
              }
  
              const id = await response.json();
              return { value: id, label: member.label };
          }));
  
          // Update members directly in data
          data.members = updatedMembers;
  
          // Add isGroup to data
          
  
          // Send final request to create conversation
          const response = await fetch('/api/conversations', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...data,
                members: updatedMembers,
                isGroup: true,
                currentUserId: session?.user?.id, 
              }),
          });
  
          if (!response.ok) {
              throw new Error('Failed to create conversation');
          }
  
          router.refresh();
          onClose();
      } catch (error) {
          toast.error('Something went wrong');
      } finally {
          setIsLoading(false);
      }
  }
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
           <div className='border-b  border-gray-900/10 pb-12'>
         <h2 className='text-base font-semibold leading-7 text-gray-900'>
          Create a Group Chat 
         </h2>
         <p className='mt-1 text-sm leading-6'>
           Create a chat with more than 2 people .
         </p>
         <div className='mt-10 flex flex-col gap-y-8'>
             
          <Input 
          register={register}
          label='Name'
          id='name'
          disabled={isLoading}
          required
          errors={errors}
          />

          <Select
          disabled={isLoading}
          label="Members"
          options={users.map((users)=>({
            value:users.id,
            label:users.name
          }))}
           onChange={(value)=>setValue('members',value,{
            shouldValidate:true
           })}
           value={members}
          />

         </div>
           </div>
        </div>
        <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button 
            type='button'
            onClick={onClose}
            disabled={isLoading}
            className='text-sm font-medium text-gray-700 hover:text-gray-900'
          >
            Cancel
          </button>
          <button 
            type='submit'
            disabled={isLoading}
            className='text-sm font-medium text-blue-600 hover:text-blue-500'
          >
            Create
          </button>

        </div>
      </form>
    </Modal>
  )
}

export default GroupChatModal

