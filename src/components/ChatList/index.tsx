"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FriendsList from "../Friends";

interface ChatList {
  id: string;
  name: string;
}

const ChatList = () => {

  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0">
      <div className="px-5 py-24  " >
        <div className="flex-col justify-center">
          <div className="text-2xl font-bold text-neutral-800 pt-30 pb-10 text-center ">People</div>
        </div>
        <FriendsList/>
      </div>
    </aside>
  );
};

export default ChatList;
