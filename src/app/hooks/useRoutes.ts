import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import React from 'react';
import { HiChat, HiUsers } from 'react-icons/hi';
import useConversation from './useConversation';

const useRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { conversationId } = useConversation();

  const handleNavigate = (path: string) => {
    console.log(`Navigating to ${path}`);
    router.push(path);
  };

  const routes = useMemo(() => [
    {
      label: 'Chat',
      href: '/conversations',
      icon: HiChat,
      active: pathname === '/conversations' || !!conversationId,
      onClick: () => handleNavigate('/conversations'),
    },
    {
      label: 'Users',
      href: '/chats',
      icon: HiUsers,
      active: pathname === '/chats',
      onClick: () => handleNavigate('/chats'),
    },
  ], [pathname, conversationId]);

  return routes;
};

export default useRoutes;
