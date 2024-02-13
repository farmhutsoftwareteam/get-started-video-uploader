import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showName, setShowName] = useState('');
  const [episode, setEpisode] = useState('');
  const [season, setSeason] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsPaid(e.target.checked);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.target.value = ''; // Clear the input
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadComplete(false);
    setUploadError('');
    setIsUploading(true);
  
    const data = new FormData();
    data.append('file', file);
    data.append('title', title);
    data.append('description', description);
    data.append('tags', tags.join(', ')); // Assuming tags are to be sent as a comma-separated string
    
    // Prepare metadata, now including showName, episode, and season
    const metadata = [];
    if (category) metadata.push({ key: "categories", value: category });
    if (isPaid !== undefined) metadata.push({ key: "isPaid", value: String(isPaid) });
    if (showName) metadata.push({ key: "showName", value: showName });
    if (episode) metadata.push({ key: "episode", value: episode });
    if (season) metadata.push({ key: "season", value: season });

    if (metadata.length > 0) {
      data.append('metadata', JSON.stringify(metadata));
    }
  
    try {
      const response = await axios.post(`https://hstvserver.azurewebsites.net/upload`, data, {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setUploadComplete(true);
      onUpload(response.data); // Pass the response data to the onUpload prop function
      setIsUploading(false);
    } catch (error) {
      setUploadError(error.response ? error.response.data.message : error.message);
      setIsUploading(false);
    }
  };
  
    // Generate options for episode and season dropdowns
    const generateNumberOptions = (from, to) => {
      let options = [];
      for (let i = from; i <= to; i++) {
        options.push(<option key={i} value={i}>{i}</option>);
      }
      return options;
    };
  


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-left">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upload New Video</h3>
          <form onSubmit={handleSubmit} className="flex flex-col items-start">
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
             <div className="mt-4 w-full min-w-0">
             <label
  htmlFor="video-upload"
  className="flex justify-center items-center w-full h-32 bg-white text-gray-400 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
>
  {fileName ? (
    <span className="text-gray-700">{fileName}</span>
  ) : (
    <>
      <UploadCloud size={24} />
      <span className="ml-2">Drag files here or click to upload</span>
    </>
  )}
</label>
    <input
      id="video-upload"
      type="file"
      accept="video/*"
      onChange={handleFileChange}
      className="hidden"
    />
  </div>
            <label htmlFor="category" className="mt-2">Category:</label>
            <input
              id="category"
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400"
            />
            <label htmlFor="showName" className="mt-2">Show Name:</label>
            <input
              id="showName"
              type="text"
              placeholder="Enter show name"
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              className="w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400"
            />
            <label htmlFor="season" className="mt-2">Season:</label>
            <select
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400"
            >
              <option value="">Select season</option>
              {generateNumberOptions(1, 20)}
            </select>
            <label htmlFor="episode" className="mt-2">Episode:</label>
            <select
              id="episode"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              className="w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400"
            >
              <option value="">Select episode</option>
              {generateNumberOptions(1, 50)}
            </select>
            <label className="mt-2">Tags:</label>
            <div className="flex flex-wrap items-center w-full mt-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-300">
                  {tag}
                  <button type="button" onClick={() => removeTag(index)} className="text-gray-400 ml-2 hover:text-gray-600 dark:hover:text-gray-300">
                    &times;
                  </button>
                </div>
              ))}
              <input
                type="text"
                onKeyDown={handleKeyDown}
                placeholder="Type and press space to add a tag"
                className="flex-1 w-full px-3 py-2 min-w-0 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400"
              />
            </div>
            <div className="mt-4 flex items-center">
              <label htmlFor="isPaid" className="inline-flex items-center">
                <input
                  id="isPaid"
                  type="checkbox"
                  checked={isPaid}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                /><span className="ml-2 text-gray-700">Is Paid Content?</span>
              </label>
            </div>
            {!isUploading && (
              <div className="flex justify-between items-center w-full mt-4">
                <button
                  onClick={onClose}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Close
                </button>
                <button
                  type="submit"
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
