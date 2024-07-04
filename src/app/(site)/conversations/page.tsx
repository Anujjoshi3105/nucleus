"use client"

import React from 'react';
import clsx from 'clsx';
import useConversation from '@/app/hooks/useConversation';
import EmptyState from '@/components/EmptyState';

const ConversationPage = () => {
  const { isOpen } = useConversation();

  return (
    <div
      className={clsx(
        "lg:pl-80 h-full lg:block ",
        isOpen ? 'block' : 'hidden'
      )}
    >
      <EmptyState />
    </div>
  );
}

export default ConversationPage;
