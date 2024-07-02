"use client"

import React from 'react'
import EmptyState from '@/components/EmptyState'
import { useRouter } from 'next/navigation';
import { useSession  } from 'next-auth/react';
import { useEffect } from 'react';


const Chatpage = () => {

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      router.push('/signin');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className='hidden lg:block lg:pl-80 h-full'>
     <EmptyState/>
    </div>
  )
}

export default Chatpage