'use client';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { useState } from 'react';

export default function FileUpload() {
  return (
    <div className="flex justify-center items-center h-screen p-4 ">
      <div className="w-full max-w-md bg-gray-700 p-4 rounded-lg">
        <FilePond
          className="w-full"
          server={{
            process: '/api/upload',
            fetch: null,
            revert: null,
          }}
        />
      </div>
    </div>
  );
}
