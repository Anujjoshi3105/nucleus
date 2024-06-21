"use client"

import { FC } from 'react';

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: FC<PopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <p>{message}</p>
        <button onClick={onClose} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
      </div>
    </div>
  );
};

export default Popup;
