

import React from "react";
import SideBar from "@/components/SideBar";
import ConversationList from "@/components/ConversationList";
import getConversations from "@/actions/getConversations";

export default async function ServerConversationLayout({ children }: { children: React.ReactNode }) {


    const conversations = await getConversations();
   
    return (
        <SideBar>
        <div className="h-full">
            <ConversationList />
            {children}
        </div>
    </SideBar>
    );
}
