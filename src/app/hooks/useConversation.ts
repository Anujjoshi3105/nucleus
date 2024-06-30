import { useParams } from "next/navigation";
import { useMemo } from "react";
import React from 'react';

const useConversation = () => {
    const params = useParams();
    
    const conversationId = useMemo(() => {
        if (!params?.conversationId) {
            return '';
        }

        return params.conversationId as String;
    }, [params?.conversationId]);

    const isOpen = useMemo(() =>
        !!conversationId,
    [conversationId]);

    return useMemo(() => ({
        isOpen,
        conversationId
    }), [isOpen, conversationId]);
}

export default useConversation;
