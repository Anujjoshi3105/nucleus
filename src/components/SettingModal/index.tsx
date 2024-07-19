"use client"

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Avatara from '../Avatara';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from '../Modal';

interface SettingModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currUser, setCurrUser] = useState<any>(null);

  useEffect(() => {
    if (!session) {
      router.push('/signin');
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/getCurrentUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: (session?.user as any).id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch current user');
        }

        const data = await response.json();
        setCurrUser(data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currUser?.name || '',
      image: <Avatara />
    }
  });

  const image =watch('image');
  
  const handleUpload =(result:any)=>{
    setValue('image',result?.info?.secure_url,{
        shouldValidate:true
    });

  }
   const onSubmit :SubmitHandler<FieldValues>=(data) =>{
    setIsLoading(true);

    axios.post('/api/settings',data)
    .then(()=>{
        router.refresh();
        onClose();
    })
    .catch(()=>toast.error("Something went wrong"))
    .finally(()=>setIsLoading(false));
   }


  if (!isOpen || !currUser) return null;

  return (
   <Modal isOpen={isOpen} onClose={onClose}>
<form onSubmit={handleSubmit(onSubmit)}>
     <div className='space-y-12 '>
    <div className='border-b border-gray-900/10 pb-12'>
       <h2 className='text-base font-semibold leading-7 text-gray-900'>
        Profile
       </h2>
       <p className='mt-1 text-sm leading-6 text-gray-600'>
         Edit your Profile Information
       </p>
       <div className='mt-10 flex flex-col gap-y-8 '>
        EDIT
       </div>
    </div>
     </div>
</form>
   </Modal>
  );
}

export default SettingModal;
