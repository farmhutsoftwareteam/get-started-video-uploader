import { useState } from 'react';
import axios from 'axios';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // New state variable
  const serverUrl = process.env.SERVER_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadComplete(false);
    setUploadError('');
    if (file) {
      setIsUploading(true); // Start of upload
      await handleUpload(file);
      setIsUploading(false); // Reset after upload is done
    }
  };

  const handleUpload = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('title', title);
    data.append('description', description);

    try {
      const response = await axios.post(`https://hstvserver.azurewebsites.net/upload`, data, {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setUploadComplete(true);
      onUpload(response.data); // Pass the response data to the onUpload prop function
    } catch (error) {
      setUploadError(error.response ? error.response.data.message : error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-left">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upload New Video</h3>
          <form onSubmit={handleSubmit} id="upload-form" className="flex flex-col items-start">
            <label htmlFor="title" className="mt-2">Title:</label>
            <input
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400"
            />
            <label htmlFor="description" className="mt-2">Description:</label>
            <textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-28 px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400"
            />
            <label htmlFor="file" className="mt-2">Video File:</label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm"
            />
            {!isUploading && ( // Conditionally render based on isUploading
              <div className="flex justify-between items-center mt-4 w-full">
                <button
                  onClick={onClose}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  form="upload-form"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            )}
          </form>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full">
              <div className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${uploadProgress}%` }}>
                {uploadProgress}%
              </div>
            </div>
          )}
          {uploadComplete && (
            <div className="mt-2 text-green-600">
              Upload complete!
            </div>
          )}
          {uploadError && (
            <div className="mt-2 text-red-600">
              Error: {uploadError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
