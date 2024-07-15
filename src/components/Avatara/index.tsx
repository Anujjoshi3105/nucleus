import React from 'react';
import Image from 'next/image';

interface AvataraProps {
  onClick?: () => void;
}

const Avatara: React.FC<AvataraProps> = ({ onClick }) => {
  return (
    <div className='relative' onClick={onClick}>
      <div className='relative inline-block rounded-full ring-offset-blue-700 overflow-hidden h-9 w-9 md:h-11 md:w-11'>
        <Image src="/images/xyzavatar.jpeg" width={30} height={30} alt='avatar' />
      </div>
      <span className='absolute block rounded-full bg-green-500 ring-1 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3' />
    </div>
  );
}

export default Avatara;
