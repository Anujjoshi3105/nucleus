"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatara from "../Avatara";

interface IUser {
  _id: string;
  email: string;
}

interface IMessage {
  _id: string;
  body?: string;
  image?: string;
  createdAt: Date;
  seen: { name: string }[];
  sender: { name: string };
}

interface IConversation {
  _id: string;
  createdAt: Date;
  lastMessageAt: Date;
  name?: string;
  isGroup?: boolean;
  messageIds: string[];
  messages: IMessage[];
  userIds: string[];
  users: IUser[];
}

interface HeaderProps {
  conversation: IConversation;
}

const ConversationHeader: React.FC<HeaderProps> = ({ conversation }) => {
  const [otherUserName, setOtherUserName] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/signin");
      return;
    }

    const fetchOtherUserName = async () => {
      try {
        const response = await fetch("/api/getOtherUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversation._id,
            sessionUserId: session?.user?.id,
          }),
        });

        if (response.ok) {
          const { name } = await response.json();
          setOtherUserName(name);
        } else {
          console.error("Failed to fetch other user name");
        }
      } catch (error) {
        console.error("Error fetching other user name:", error);
      }
    };

    if (session?.user?.id) {
      fetchOtherUserName();
    }
  }, [conversation._id, session?.user?.id, router, session]);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return "Active";
  }, [conversation]);

  return (
    <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 pt-24 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
          href="/conversations"
        >
          <HiChevronLeft size={32} />
        </Link>
        <Avatara />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">
            {conversation.name || otherUserName}
          </span>
          <span className="text-sm font-light text-neutral-500">
            {statusText}
          </span>
        </div>
      </div>
      <HiEllipsisHorizontal
        size={32}
        onClick={() => {}}
        className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
      />
    </div>
  );
};

export default ConversationHeader;
