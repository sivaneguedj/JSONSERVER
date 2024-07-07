import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import ImageCell from "./ImageCell";
import FetchAlbums from "./FetchAlbums";
import '/src/styles/ListOfPhotos.module.css';

const ListOfPhotos = () => {
    const { albumId } = useParams();
    const { data: photos, loading, setData: setPhotos } = FetchAlbums(`photos?albumId=${albumId}`);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadedImages, setLoadedImages] = useState(0);
    const photosPerPage = 10;
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [updatedPhotoUrl, setUpdatedPhotoUrl] = useState('');
    const [editingPhotoId, setEditingPhotoId] = useState(null); // State to track which photo is being edited

    useEffect(() => {
        setLoadedImages(0);
    }, [currentPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!photos || photos.length === 0) {
        return <div>No photos found.</div>;
    }

    const indexOfLastPhoto = currentPage * photosPerPage;
    const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
    const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

    const handleImageLoad = () => {
        setLoadedImages(prev => prev + 1);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(photos.length / photosPerPage);

    const addPhoto = async () => {
        const newPhoto = {
            albumId,
            url: newPhotoUrl,
            thumbnailUrl: newPhotoUrl
        };

        try {
            const response = await fetch('http://localhost:3500/photos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPhoto),
            });
            if (!response.ok) {
                throw new Error('Failed to add photo');
            }

            const addedPhoto = await response.json();
            setPhotos(prevPhotos => [...prevPhotos, addedPhoto]);
            setNewPhotoUrl('');
        } catch (error) {
            console.error('Error adding photo:', error);
        }
    };

    const deletePhoto = async (photoId) => {
        try {
            const response = await fetch(`http://localhost:3500/photos/${photoId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete photo');
            }

            setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    const updatePhoto = async (photoId) => {
        const updatedPhoto = {
            url: updatedPhotoUrl,
            thumbnailUrl: updatedPhotoUrl
        };

        try {
            const response = await fetch(`http://localhost:3500/photos/${photoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPhoto),
            });
            if (!response.ok) {
                throw new Error('Failed to update photo');
            }

            setPhotos(prevPhotos => prevPhotos.map(photo => photo.id === photoId ? { ...photo, ...updatedPhoto } : photo));
            setUpdatedPhotoUrl('');
            setEditingPhotoId(null); // Reset editing state
        } catch (error) {
            console.error('Error updating photo:', error);
        }
    };

    const handleEditPhoto = (photoId) => {
        setEditingPhotoId(photoId);
        // Optionally, you can preload the current URL of the photo being edited
        const photoToUpdate = photos.find(photo => photo.id === photoId);
        if (photoToUpdate) {
            setUpdatedPhotoUrl(photoToUpdate.url);
        }
    };

    return (
        <div>
            <h1>Photos of {albumId}</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter new photo URL"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                />
                <button onClick={addPhoto}>Add Photo</button>
            </div>
            <div className="photos-grid">
                {currentPhotos.map((photo, index) => (
                    <div key={photo.id}>
                        <ImageCell
                            photo={photo}
                            url={photo.thumbnailUrl}
                            onLoad={handleImageLoad}
                            onDelete={deletePhoto}
                            onUpdate={() => updatePhoto(photo.id)}
                        />
                        {editingPhotoId === photo.id && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter updated photo URL"
                                    value={updatedPhotoUrl}
                                    onChange={(e) => setUpdatedPhotoUrl(e.target.value)}
                                />
                                <button onClick={() => updatePhoto(photo.id)}>Update</button>
                            </div>
                        )}
                        {!editingPhotoId && (
                            <button onClick={() => handleEditPhoto(photo.id)}>Update</button>
                        )}
                    </div>
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ListOfPhotos;
