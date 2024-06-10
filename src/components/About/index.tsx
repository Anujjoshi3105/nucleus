"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

const About: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [url, setUrl] = useState('');
  const [newLinkMetadata, setNewLinkMetadata] = useState<any>(null);
  const [links, setLinks] = useState<{ url: string, metadata: any }[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  const [userProfile, setUserProfile] = useState<any>({
    name: '',
    college: '',
    about: '',
    skills: [''],
    experience: [''],
    education: [''],
    certificates: [''],
    achievements: [''],
    links: [{ url: '', title: '', description: '', image: '' }],
    useremail: '',
    user: ''
  });

  const fetchUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/userprofile/${email}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const profile = await response.json();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserProfile(prevProfile => ({
        ...prevProfile,
        user: session.user?.id,
        useremail: session.user?.email
      }));
      fetchUserProfile(session.user.email);
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, session]);

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    const linksToSave = links.map(link => link.url);

    const profileToSave = {
      ...userProfile,
      links: linksToSave
    };

    try {
      const response = await fetch('/api/userprofile', {
        method: 'POST',
        body: JSON.stringify(profileToSave),
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
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

  const fetchMetadata = async (url: string) => {
    try {
      const response = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleAddButtonClicked = async () => {
    if (url.trim() !== '') {
      const metadata = await fetchMetadata(url);
      if (metadata) {
        const { title, description, image } = metadata;
        setLinks(prevLinks => [...prevLinks, { url, metadata: { title, description, image } }]);
        setUrl('');
        setNewLinkMetadata(null); // Reset new link metadata
      }
    }
  };

  const handleEditButtonClicked = (index: number) => {
    setUrl(links[index].url);
    setNewLinkMetadata(links[index].metadata);
    setEditIndex(index);
  };

  const handleSaveButtonClicked = async () => {
    if (url.trim() !== '' && editIndex !== null) {
      const metadata = await fetchMetadata(url);
      if (metadata) {
        const { title, description, image } = metadata;
        const updatedLinks = [...links];
        updatedLinks[editIndex] = { url, metadata: { title, description, image } };
        setLinks(updatedLinks);
        setUrl('');
        setEditIndex(null);
        setNewLinkMetadata(null); // Reset new link metadata
      }
    }
  };

  const handleDeleteButtonClicked = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
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
        {['name', 'college', 'about'].map(field => (
          <div key={field}>
            <label className="font-medium capitalize">{field}</label>
            {field === 'about' ? (
              <textarea
                value={userProfile[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            ) : (
              <input
                type="text"
                value={userProfile[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            )}
          </div>
        ))}

        {['skills', 'experience', 'education', 'certificates', 'achievements'].map((key) => (
          <div key={key}>
            <label className="font-medium capitalize">{key}</label>
            {userProfile[key].map((item: any, index: number) => (
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

        <div>
          <label className="font-medium">Links</label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="Enter URL"
              className="w-full px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
            <button
              type="button"
              onClick={editIndex === null ? handleAddButtonClicked : handleSaveButtonClicked}
              className="px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
            >
              {editIndex === null ? 'Add' : 'Save'}
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {links.map((link, index) => (
              <li key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="text-white">{link.url}</div>
                  {link.metadata && (
                    <div className="text-gray-400 text-sm">
                      {link.metadata.title && <div>Title: {link.metadata.title}</div>}
                      {link.metadata.description && <div>Description: {link.metadata.description}</div>}
                      {link.metadata.image && (
                        <div>
                          <img src={link.metadata.image} alt="Link thumbnail" className="w-12 h-12 object-cover mt-1" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleEditButtonClicked(index)}
                  className="px-3 py-1 text-white bg-blue-600 rounded-md"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteButtonClicked(index)}
                  className="px-3 py-1 text-white bg-red-600 rounded-md"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="mt-2 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
        >
          Save Profile
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default About;
