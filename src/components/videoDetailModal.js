import ReactPlayer from 'react-player';
import { XCircle } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';

const VideoDetailModal = ({ video, isOpen, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    if (!isOpen || !video) return null;

    const handleEdit = () => {
      console.log("Edit", video.videoId);
      // Implement edit functionality
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
          const response = await axios.delete(`https://hstvserver.azurewebsites.net/video`, {
            data: { videoId: video.videoId }
          });
          console.log(response.data); // For debugging
          setDeleteSuccess(true);
          setTimeout(() => {
            onClose(); // Close the modal
            setIsDeleting(false); // Reset deleting state
            setDeleteSuccess(false); // Reset success state
            window.location.reload(); // Reload the page to reflect changes
          }, 2000); // Delay for showing the success message before reloading
        } catch (error) {
          console.error("Failed to delete the video", error);
          setIsDeleting(false); // Stop loading if there's an error
        }
    };
    

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
        <div className="relative bg-white p-4 rounded-lg max-w-4xl w-full space-y-4">
          {isDeleting ? (
            // Spinner
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : deleteSuccess ? (
            // Success message
            <div className="text-center text-green-500">
              Video successfully deleted.
            </div>
          ) : (
            // Modal content when not deleting or showing success
            <>
              <div className="flex gap-4">
                <ReactPlayer 
                  url={video.assets.mp4}
                  width='100%'
                  height='100%'
                  controls={true}
                  className="w-full md:w-1/2 h-64 md:h-auto"
                />
                <div className="space-y-2 w-full md:w-1/2">
                  <h2 className="text-xl font-bold">{video.title}</h2>
                  <p>{video.description || 'No description available.'}</p>
                  <div>Category: <span>{video.category || 'Uncategorized'}</span></div>
                  <div>Tags: <span>{video.tags?.join(', ') || 'None'}</span></div>
                  <div>Posted on: <span>{new Date(video.publishedAt).toLocaleDateString()}</span></div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded">Edit</button>
                <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 bg-red-500 text-white rounded">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </>
          )}
          <button onClick={() => { onClose(); setDeleteSuccess(false); }} className="absolute top-2 right-2 text-lg font-bold">
            <XCircle size={24} color='red'/>
          </button>
        </div>
      </div>
    );
};

export default VideoDetailModal;
