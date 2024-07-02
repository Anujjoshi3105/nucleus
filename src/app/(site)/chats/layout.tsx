"use client"

import { useRouter } from 'next/navigation';
import { useSession  } from 'next-auth/react';
import { useEffect } from 'react';
import SideBar from "@/components/SideBar";
import ChatList from "@/components/ChatList";


export default function User({children}:{children:React.ReactNode}) {
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


      <SideBar>
          <div className="h-full">
            <ChatList/>
    {children}
        </div>
      </SideBar>
    );
    
}

