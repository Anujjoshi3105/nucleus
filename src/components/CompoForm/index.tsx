"use client";

import React from 'react';
import useConversation from '@/app/hooks/useConversation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPhoto } from 'react-icons/hi2';
import MessageInput from '../MessageInput'; // Ensure you import your MessageInput component
import { HiPaperAirplane } from 'react-icons/hi2';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CldUploadButton } from 'next-cloudinary';

const CompoForm = () => {
  const { conversationId } = useConversation();
  const { data: session, status } = useSession();
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/signin');
      return;
    }

    const userId = session.user?.id;

    setValue('message', '', { shouldValidate: true });

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          conversationId,
          sessionId: userId
        })
      });

      if (!response.ok) {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to handle image upload
  const handleUpload = async (result: any) => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/signin');
      return;
    }

    const userId = session.user?.id;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: result?.info?.secure_url,
          conversationId,
          sessionId: userId
        })
      });

      if (!response.ok) {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
      {/* Cloudinary upload button for image */}
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="h7nqrx7j"
      >
        <HiPhoto size={30} className='text-sky-500' />
      </CldUploadButton>

      {/* Message form */}
      <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2 lg:gap-4 w-full'>
        <MessageInput
          id='message'
          register={register}
          errors={errors}
          required
          placeholder="Write a Message"
        />
        <button type='submit' className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'>
          <HiPaperAirplane size={18} className='text-white' />
        </button>
      </form>
    </div>
  );
};

export default CompoForm;
