import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { XCircle, CheckCircle } from 'lucide-react';

const VideoDetailModal = ({ video, isOpen, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        isPaid: false,
        showName: '',
        season: '',
        episode: ''
    });

    useEffect(() => {
        if (video) {
            const metadata = video.metadata.reduce((acc, meta) => {
                acc[meta.key] = meta.value;
                return acc;
            }, {});
            setEditFormData({
                title: video.title || '',
                description: video.description || '',
                category: metadata.categories || 'Uncategorized',
                tags: video.tags?.join(', ') || '',
                isPaid: metadata.isPaid === 'true',
                showName: metadata.showName || '',
                season: metadata.season || '',
                episode: metadata.episode || '',
            });
        }
    }, [video]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditSuccess(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`https://hstvserver.azurewebsites.net/video`, { data: { videoId: video.videoId } });
            setDeleteSuccess(true);
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Failed to delete the video", error);
            setIsDeleting(false);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setIsDeleting(true); // Using isDeleting state for loading indication during edit

        const tagsArray = editFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

        const updatedData = {
            videoId: video.videoId,
            title: editFormData.title,
            description: editFormData.description,
            tags: tagsArray,
            metadata: [
                { key: "categories", value: editFormData.category },
                { key: "isPaid", value: String(editFormData.isPaid) },
                // Include new metadata for showName, season, and episode
                { key: "showName", value: editFormData.showName },
                { key: "season", value: editFormData.season },
                { key: "episode", value: editFormData.episode },
            ]
        };

        try {
            await axios.put(`https://hstvserver.azurewebsites.net/video`, updatedData);
            setEditSuccess(true);
            setTimeout(() => {
                setIsDeleting(false);
                setIsEditing(false);
                setEditSuccess(false);
                onClose();
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Failed to update the video", error);
            setIsDeleting(false);
        }
    };
    
    

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!isOpen || !video) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="relative bg-white p-4 rounded-lg max-w-4xl w-full space-y-4">
                {isDeleting ? (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : deleteSuccess || editSuccess ? (
                    <div className="text-center">
                        <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                        <p className="text-green-500">{deleteSuccess ? "Video successfully deleted." : "Video successfully updated."}</p>
                    </div>
                ) : isEditing ? (
                    <form onSubmit={handleSubmitEdit} className="space-y-4">
                        <input name="title" value={editFormData.title} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Title" />
                        <textarea name="description" value={editFormData.description} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Description"></textarea>
                        <input name="category" value={editFormData.category} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Category" />
                        <input name="tags" value={editFormData.tags} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Tags (comma separated)" />
                        <input name="showName" value={editFormData.showName} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Show Name" />
                        <input name="season" type="number" value={editFormData.season} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Season" />
                        <input name="episode" type="number" value={editFormData.episode} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Episode" />
                        <label className="inline-flex items-center">
                            <input type="checkbox" name="isPaid" checked={editFormData.isPaid} onChange={handleInputChange} className="form-checkbox" />
                            <span className="ml-2">Is Paid Content?</span>
                        </label>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => { setIsEditing(false); setEditSuccess(false); }} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save Changes</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex gap-4">
                            <ReactPlayer url={video.assets.mp4} width='100%' height='100%' controls={true} className="w-full md:w-1/2 h-64 md:h-auto" />
                            <div className="space-y-2 w-full md:w-1/2">
                                <h2 className="text-xl font-bold">{video.title}</h2>
                                <p>{video.description || 'No description available.'}</p>
                                <div>Category: <span>{editFormData.category}</span></div>
                                <div>Tags: <span>{editFormData.tags}</span></div>
                                <div>Posted on: <span>{new Date(video.publishedAt).toLocaleDateString()}</span></div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded">Edit</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 bg-red-500 text-white rounded">{isDeleting ? 'Deleting...' : 'Delete'}</button>
                        </div>
                    </>
                )}
                <button onClick={() => { onClose(); setIsEditing(false); setDeleteSuccess(false); setEditSuccess(false); }} className="absolute top-2 right-2 text-lg font-bold">
                    <XCircle size={24} color="red" />
                </button>
            </div>
        </div>
    );
};

export default VideoDetailModal;
