// components/VideoGallery.js
import React from 'react';
import Link from 'next/link';

function VideoGallery({ videos }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {videos.map((video) => (
                <div key={video._id} className="max-w-sm rounded overflow-hidden shadow-lg">
                    <Link legacyBehavior href={`/videos/${video._id}`}>
                        <a>
                            <img className="w-full" src={video.thumbnail} alt={video.title} />
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">{video.title}</div>
                                <p className="text-gray-700 text-base">
                                    {video.description}
                                </p>
                            </div>
                        </a>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default VideoGallery;
