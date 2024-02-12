import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoDetailModal from '../components/videoDetailModal';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.post('https://hstvserver.azurewebsites.net/videos');
        setVideos(response.data.data);
      } catch (error) {
        console.error("Failed to fetch videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
        videos.map((video) => (
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
  );
};




export default Home;
