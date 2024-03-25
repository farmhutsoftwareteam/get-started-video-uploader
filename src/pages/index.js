// pages/index.js
import React from 'react';
import VideoGallery from '../components/videoGallery';

export async function getStaticProps() {
    const res = await fetch('https://hstvvideoapp.azurewebsites.net/api/videos');
    let videos = await res.json();

    const baseUrl = 'https://hstvvideoapp.azurewebsites.net/';

    // Modify filePath and thumbnail to include the full URL
    videos = videos.map(video => ({
        ...video,
        filePath: baseUrl + video.filePath,
        thumbnail: baseUrl + video.thumbnail
    }));

    return {
        props: {
            videos,
        },
        revalidate: 10 // for Incremental Static Regeneration
    };
}

function HomePage({ videos }) {
    return (
        <div className="container mx-auto">
            <VideoGallery videos={videos} />
        </div>
    );
}

export default HomePage;
