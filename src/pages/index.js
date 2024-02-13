import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoDetailModal from '../components/videoDetailModal';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showName, setShowName] = useState('');
  const [season, setSeason] = useState('');
  const [category, setCategory] = useState('');
  const [isPaid, setIsPaid] = useState('');
  const [showNamesOptions, setShowNamesOptions] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.post('https://hstvserver.azurewebsites.net/videos');
        const videos = response.data.data
        setVideos(videos);
        setFilteredVideos(videos); 
        
         // Extract unique show names and categories from fetched videos
         const extractedShowNames = [...new Set(videos.map(video => video.metadata.find(meta => meta.key === 'showName')?.value).filter(Boolean))];
         const extractedCategories = [...new Set(videos.map(video => video.metadata.find(meta => meta.key === 'categories')?.value).filter(Boolean))];
         setShowNamesOptions(extractedShowNames);
         setCategoriesOptions(extractedCategories); 
      } catch (error) {
        console.error("Failed to fetch videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    // Filter videos based on search term
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [searchTerm, videos]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };
  
  const handleFilterChange = () => {
    // Implement filtering logic here based on selected filters
    // This function will likely need updating to actually filter videos based on the new dropdowns
    let filtered = videos;
    if (showName) {
      filtered = filtered.filter(video => video.metadata.find(meta => meta.key === 'showName')?.value === showName);
    }
    if (category) {
      filtered = filtered.filter(video => video.metadata.find(meta => meta.key === 'categories')?.value === category);
    }
    // Continue filtering for season, isPaid, etc., as needed
    setFilteredVideos(filtered);
  };
  const resetFilters = () => {
    // Reset filter states
    setShowName('');
    setSeason('');
    setCategory('');
    setIsPaid('');

    // Reset filtered videos to show all videos
    setFilteredVideos(videos);
  };

  const seasonsOptions = Array.from({ length: 10 }, (_, i) => i + 1); // Example for seasons 1-10
  


  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-4 p-4 ">
      {/* ShowName Filter */}
      <select
          value={showName}
          onChange={(e) => setShowName(e.target.value)}
          className="flex-1 form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select Show Name</option>
          {showNamesOptions.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select Category</option>
          {categoriesOptions.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

      {/* Season Filter */}
      <select
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        className="flex-1 form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">Select Season</option>
        {/* Example for seasons 1-10 */}
        {Array.from({ length: 10 }, (_, i) => i + 1).map(season => (
          <option key={season} value={season}>{`Season ${season}`}</option>
        ))}
      </select>

     

      {/* IsPaid Filter */}
      <select
        value={isPaid}
        onChange={(e) => setIsPaid(e.target.value)}
        className="flex-1 form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">Content Type</option>
        <option value="true">Paid</option>
        <option value="false">Free</option>
      </select>

      {/* Filter Application Button */}
      <button
        onClick={handleFilterChange}
        className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Apply Filters
      </button>
      <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-700 focus:outline-none"
        >
          Remove Filters
        </button>
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse flex flex-col space-y-4">
              <div className="bg-gray-300 h-52 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ))
        ) : (
          filteredVideos.map((video) => (
            <div key={video.videoId} className="flex flex-col cursor-pointer" onClick={() => handleVideoClick(video)}>
              <div className="w-full overflow-hidden rounded-lg shadow-md">
                <img src={video.assets.thumbnail} alt={video.title} className="object-cover w-full h-52 rounded-lg" />
              </div>
              <div className="mt-2">
                <h4 className="text-lg font-semibold">{video.title}</h4>
                <p className="text-sm text-gray-600">{video.description || 'No description available.'}</p>
              </div>
            </div>
          ))
        )}
        <VideoDetailModal video={selectedVideo} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
};

export default Home;
