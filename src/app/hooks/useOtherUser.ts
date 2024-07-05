import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "@/types/conversation";
import { IUser } from "@/models/User";

const useOtherUser = (conversation: FullConversationType | { users: IUser[] }) => {
  const { data: session } = useSession();

  const otherUser = useMemo(() => {
    if (!session?.user?.email || !conversation.users) {
      return null; 
    }
    const currentUserEmail = session.user.email;
    return conversation.users.find((user) => user.email !== currentUserEmail) || null;
  }, [session?.user?.email, conversation.users]);

  return otherUser;
}

export default useOtherUser;
