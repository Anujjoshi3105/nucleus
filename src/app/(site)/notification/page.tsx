'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Notification {
  _id: string;
  receiverId: string;
  senderId: string;
  message: string;
  status: string;
  createdAt: string;
  acceptedAt?: string;

}

const NotificationPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/signin');
    } else {
      fetchNotifications();
    }
  }, [session, status]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/fetch/${session?.user.id}`);
      if (response.ok) {
        const data: Notification[] = await response.json();
        console.log('Fetched notifications:', data); // Log fetched data

        if (Array.isArray(data)) {
            setNotifications(data);
          } else {
            console.error('Data is not an array:', data);
          }
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };



  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(notifications.filter(notification => notification._id !== id));
      } else {
        console.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };


  const handleAccept = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/accepts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }), 

      });
      if (response.ok) {
        // Update UI to remove accepted notification
        setNotifications(notifications.filter(n => n._id !== notificationId));
      } else {
        console.error('Error accepting notification');
      }
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };



  const handleDeny = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/deny`, {
        method: 'POST',
      });
      if (response.ok) {
        // Update UI to remove denied notification
        setNotifications(notifications.filter(n => n._id !== notificationId));
      } else {
        console.error('Error denying notification');
      }
    } catch (error) {
      console.error('Error denying notification:', error);
    }
  };

  if (!session) return <div>Loading...</div>;


  return (
    <div className="container mx-auto p-4 mt-32 mb-80">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li 
              key={notification._id} 
              className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded shadow flex justify-between items-center"
              onClick={() => handleNotificationClick(notification.senderId)}
              style={{ cursor: 'pointer' }}
            >
              <span className="text-black dark:text-white">{notification.message}</span>
              {notification.status === 'pending' ? (
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={(e) => { e.stopPropagation(); handleAccept(notification._id); }}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={(e) => { e.stopPropagation(); handleDeny(notification._id); }}
                  >
                    Deny
                  </button>
                </div>
              ) : (
                <span className="text-green-500">Accepted {notification.acceptedAt ? formatAcceptanceTime(new Date(notification.acceptedAt)) : 'just now'}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  function formatAcceptanceTime(acceptedAt: Date): string {
    const now = new Date();
    const diffMilliseconds = now.getTime() - acceptedAt.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else {
      return `just now`;
    }
  }
  
};

export default NotificationPage;
