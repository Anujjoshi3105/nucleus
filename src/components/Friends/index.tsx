"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Friend {
  id: string;
  name: string;
}

const FriendsList = () => {
  const { data: session } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!session) return;

      const userId = session.user.id; // Adjust this based on your session structure

      try {
        const response = await fetch('/api/user/friends', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }

        const data = await response.json();
        setFriends(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [session]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Friends List</h1>
      <ul>
        {friends.map(friend => (
          <li key={friend.id}>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
