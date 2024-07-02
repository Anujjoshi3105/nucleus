"use client"

import React from 'react';
import FriendsList from '@/components/Friends'; 
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const FriendsPage = () => {
  
    const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') return;
  if (!session) {
    router.push('/signin');
  }

  return (
    <div>
      <h1>Your Friends</h1>
      <FriendsList />
    </div>
  );
};


export default FriendsPage;