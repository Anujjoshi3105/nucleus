"use client"

import React from 'react';
import FriendsList from '@/components/Friends'; 
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import UploadPDF from '@/components/Assignment/UploadPDF';
import FileUpload from '@/components/File_Upload/file-upload';
const FriendsPage = () => {
  
    const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') return;
  if (!session) {
    router.push('/signin');
  }

  return (
    <div>
    <FileUpload/>
    </div>
  );
};


export default FriendsPage;