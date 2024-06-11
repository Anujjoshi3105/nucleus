"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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

const ProfileDetail: React.FC = () => {
  const { id } = useParams();
  console.log('Profile ID:', id);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-gray-800 dark:text-gray-200">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center mt-32 mb-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full md:w-3/4 lg:w-1/2">
        <div className="flex flex-col items-center mb-6">
        <Image className='rounded-full ring-blue-900 p-2' src="/xyzavatar.jpeg" width={300} height={300} alt='avatar' />
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">{profile.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>College:</strong> {profile.college}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>About:</strong> {profile.about}</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
            Connect
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 w-full">
          <Section title="Education" items={profile.education} />
          <Section title="Skills" items={profile.skills} />
          <Section title="Experience" items={profile.experience} />
          <Section title="Certificates" items={profile.certificates} />
          <Section title="Achievements" items={profile.achievements} />
          <Section title="Links" items={profile.links.map(link => (
            <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 underline">
              {link}
            </a>
          ))} />
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  items: string[] | React.ReactNode[];
}

const Section: React.FC<SectionProps> = ({ title, items }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-200">{title}</h2>
      <ul className="list-disc list-inside ml-4">
        {items.map((item, index) => (
          <li key={index} className="text-gray-600 dark:text-gray-300">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileDetail;
