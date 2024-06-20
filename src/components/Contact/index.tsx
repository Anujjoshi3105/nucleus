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



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">User Profiles</h1>
      {message && <p className="text-red-500">{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profiles.map(profile => (
          <div key={profile._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-center mb-4">
            <Image className='rounded-lg ring-blue-900 p-2' src="/xyzavatar.jpeg" width={300} height={300} alt='avatar' />
            </div>
            <h2 className="text-lg font-bold text-center">{profile.name}</h2>
            <p className="text-center text-gray-500">{profile.college}</p>
            <p className="mt-2">{profile.about}</p>
            <div className="mt-2">
              <h3 className="font-semibold">Education</h3>
              <ul className="list-disc list-inside">
                {profile.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-around mt-4">
              <Link href={`/contact/${profile._id}`}>
                <button className="text-indigo-600">View Profile</button>
              </Link>
              <button
                onClick={() => alert(`Connect with ${profile.name}`)}
                className="text-blue-600"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
