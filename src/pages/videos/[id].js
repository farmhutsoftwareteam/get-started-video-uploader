import React from "react";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`https://hstvvideoapp.azurewebsites.net/api/videos/${id}`);
  const video = await res.json();

  return {
    props: {
      video,
    },
  };
}

function VideoDetail({ video }) {
  if (!video || !video.video) {
    return <div>Video not found</div>;
  }

  const videoDetails = video.video;

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      <div className="flex-1">
        <video width="100%" controls>
          <source
            src={`https://hstvvideoapp.azurewebsites.net/${videoDetails.filePath}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex-1 ml-4">
        <h1 className="text-2xl font-bold mb-2">{videoDetails.title}</h1>
        <p className="mb-4">{videoDetails.description}</p>
        <ul>
          {/* Render more details as needed */}
          <li><strong>Upload Date:</strong> {new Date(videoDetails.uploadDate).toLocaleDateString()}</li>
          <li><strong>Views:</strong> {videoDetails.views}</li>
          <li><strong>Tags:</strong> {videoDetails.tags.join(', ')}</li>
          {/* Add more details as needed */}
        </ul>
      </div>
    </div>
  );
}

export default VideoDetail;
