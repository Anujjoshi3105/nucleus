import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Avatara from '../Avatara';
import LoadingModal from '../LodingModal';

interface Friend {
  id: string;
  name: string;
}

const FriendsList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/signin');
      return;
    }

    const userId = (session.user as any).id;
    setLoading(true);

    try {
      const response = await fetch('/api/chatfriends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      const data: Friend[] = await response.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleClick = useCallback(
    async (friendId: string) => {
      console.log('handleClick called with friendId:', friendId);
      setLoading(true);

      try {
        const userIdFindResponse = await fetch('/api/userIdFind', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            friendId,  
          }),
        });
  
        if (!userIdFindResponse.ok) {
          throw new Error('Failed to find user ID');
        }
  
        const userIdFindData = await userIdFindResponse.json();

        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userIdFindData.userId,
            currentUserId: (session?.user as any).id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to start conversation');
        }

        const data = await response.json();
        
        console.log('Conversation started with data:', data);
        router.push(`/conversations/${data._id}`);
      } catch (error) {
        console.error('Error starting conversation:', error);
        setError('Error starting conversation');
      } finally {
        setLoading(false);
      }
    },
    [router, session]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {loading && <LoadingModal />}
      <div>
        <ul>
          {Array.isArray(friends) && friends.length > 0 ? (
            friends.map((friend) => (
              <li
                key={friend.id}
                onClick={() => handleClick(friend.id)}
                className='w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer'
              >
                <Avatara />
                <div className='min-w-0 flex-1'>
                  <div className='focus:outline-none'>
                    <div className='flex justify-between items-center mb-1'>
                      <p className='text-sm font-medium text-gray-900'>
                        {friend.name}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No friends found</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default FriendsList;
