"use client"

import React, { useMemo } from 'react'
import { IConversation } from '@/models/Conversation'
import { IUser } from '@/models/User'
import { format } from 'date-fns'


interface ProfileDrawerProps{
    
    otherUserName: string | null;
    isOpen: boolean;
    onClose: () => void
    data:IConversation &{
        users:IUser[]
    }
}

const ProfileDrawer:React.FC<ProfileDrawerProps> = ({ data, otherUserName, isOpen, onClose }) => {


//    const joinedDate =useMemo(()=>{
//     return format(new Date(otherUserName.createdAt),'PP');
//    },[otherUserName.createdAt])

  return (
    <div>ProfileDrawer</div>
  )
}

export default ProfileDrawer