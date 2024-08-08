import React, { useState } from 'react';

const UploadPDF: React.FC = () => {
  const [pdfText, setPdfText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/assignment/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setPdfText(data.text);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-lg mx-auto  rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-16 mt-40 text-green-900">Upload PDF</h1>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 mt-7 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Upload
      </button>
      {pdfText && (
        <div className="mt-6 w-full">
          <h2 className="text-xl font-medium mb-2 text-gray-800">Extracted PDF Text</h2>
          <pre className="whitespace-pre-wrap bg-white p-4 border border-gray-200 rounded-md shadow-sm">
            {pdfText}
          </pre>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
