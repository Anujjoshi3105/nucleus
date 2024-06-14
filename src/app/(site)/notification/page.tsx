'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Notification {
  _id: string;
  receiverId: string;
  senderId: string;
  message: string;
  createdAt: string;
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
      const response = await fetch(`/api/notifications/${session?.user.id}`);
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
      const response = await fetch(`/api/notifications/${notificationId}/accept`, {
        method: 'POST',
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
            <li key={notification._id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded shadow flex justify-between items-center">
              <span className="text-black dark:text-white">{notification.message}</span>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleAccept(notification._id)}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => handleDeny(notification._id)}
                >
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
