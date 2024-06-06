"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

const About: React.FC  = () => {
  
  const { data: session, status } = useSession();
  const router = useRouter();


  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const [userProfile, setUserProfile] = useState<any>({
    name: '',
    college: '',
    about: '',
    skills: [''],
    experience: [''],
    education: [''],
    certificates: [''],
    achievements: [''],
    links: [''],
    useremail:'',
    user: ''            
  });


  const [message, setMessage] = useState<string>('');

  // const fetchUserProfile = async (user: string) => {
  //   try {
  //     const response = await fetch(`/api/userprofile/${session?.user?.email}`,{
  //       method :'GET',
  //     });
  //     const profile = await response.json();
  //     if (profile) {
  //       setUserProfile(profile);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user profile:', error);
  //   }
  // };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserProfile(prevProfile => ({
        ...prevProfile,
        user:session.user?.id,
        useremail:session.user?.email // Set the user email from the session data
      }));
      // fetchUserProfile(session.user.email);
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, session]);


  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    try {
      const response = await fetch('/api/userprofile', {
        method: 'POST',
        body: JSON.stringify(userProfile),
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 200) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Profile update failed');
      }
    } catch (error: any) {
      setMessage(`An error occurred: ${error.message}`);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayInputChange = (key: string, index: number, value: string) => {
    setUserProfile(prev => {
      const newArray = [...prev[key]];
      newArray[index] = value;
      return { ...prev, [key]: newArray };
    });
  };

  const handleAddField = (key: string) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: [...prev[key], '']
    }));
  };

  const handleRemoveField = (key: string, index: number) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: prev[key].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  if (status === 'loading') {
    return 'Loading...';
  }


  return (
    <div className="flex-1 mt-12 max-w-md mb-24 mx-auto">
    <div>
      <h1 className='text-rose-400 mb-16 text-center font-bold text-xl'>PROFILE PAGE</h1>
    </div>
    <div className='relative items-center'>
      {imageUrl ? (
        <Image className='rounded-lg ring-blue-900 p-2' src={imageUrl} width={300} height={300} alt='avatar' />
      ) : (
        <Image className='rounded-lg ring-blue-900 p-2' src="/xyzavatar.jpeg" width={300} height={300} alt='avatar' />
      )}
      <input
        type='file'
        onChange={handleImageChange}
        className='hidden'
        id='imageUpload'
      />
      <label htmlFor='imageUpload' className='px-24 cursor-pointer'>Edit</label>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="font-medium grow">Name</label>
        <input
          type="text"
          value={userProfile.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
        />
      </div>
      <div>
        <label className="font-medium">College</label>
        <input
          type="text"
          value={userProfile.college}
          onChange={(e) => handleInputChange('college', e.target.value)}
          required
          className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
        />
      </div>
      <div>
        <label className="font-medium">About</label>
        <textarea
          value={userProfile.about}
          onChange={(e) => handleInputChange('about', e.target.value)}
          required
          className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
        />
      </div>
      {['skills', 'experience', 'education', 'certificates', 'achievements', 'links'].map((key) => (
        <div key={key}>
          <label className="font-medium capitalize">{key}</label>
          {userProfile[key].map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayInputChange(key, index, e.target.value)}
                required
                className="w-full px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(key, index)}
                className="px-3 py-1 text-white bg-red-600 rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField(key)}
            className="mt-2 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
          >
            Add {key}
          </button>
        </div>
      ))}
      <button
        type="submit"
        className="w-full px-4 py-2 mt-24 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
      >
        Save
      </button>
    </form>
    {message && (
      <div className="mt-4 text-center text-red-500">
        {message}
      </div>
    )}
  </div>
  );
};

export default About;


