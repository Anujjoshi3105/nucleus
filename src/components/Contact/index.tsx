"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Profile {
  _id: string;
  name: string;
  college: string;
  education: string[];
  about: string;
  skills: string[];
  experience: string[];
  certificates: string[];
  achievements: string[];
  links: string[];
  useremail: string;
  user: string;
}

const Profiles: React.FC = () => {
  const { data: session } = useSession();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [message, setMessage] = useState<string>('');


 
  useEffect(() => {
    
    const fetchProfiles = async () => {
    
      try {
        const response = await fetch('/api/profiles');
        const data = await response.json();
        setProfiles(data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setMessage('Error fetching profiles');
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (session?.user) {
      console.log(session);
      setProfiles(prevProfiles => prevProfiles.filter(profile => profile.user !== session?.user?.id));
    }
  }, [session]);


  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">User Profiles</h1>
      {message && <p className="text-red-500 text-center">{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {profiles.map(profile => (
          <Link href={`/contact/${profile._id}`} key={profile._id}>
            <div className="bg-gray-700 rounded-lg shadow-md p-6 cursor-pointer transition-transform transform hover:translate-y-[-10px] hover:shadow-xl">
              <div className="flex items-center justify-center mb-6">
              <Image className='rounded-full ring-blue-900 p-2' src="/xyzavatar.jpeg" width={300} height={300} alt='avatar' />
              </div>
              <h2 className="text-lg font-bold text-center text-gray-200">{profile.name}</h2>
              <p className="text-center text-gray-400">{profile.college}</p>
              <p className="mt-4 text-gray-300 text-justify">{profile.about}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
