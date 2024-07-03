import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FetchAlbums from './FetchAlbums';
import SearchItem from './SearchItem';
import ListOfPhotos from './ListOfPhotos';

const Albums = () => {
    const { userId } = useParams();
    const [search, setSearch] = useState('');
    const [searchBy, setSearchBy] = useState('title');
    const [nextId, setNextId] = useState(1); // Définir l'ID initial à 1
    const actualUser = JSON.parse(localStorage.getItem('user')) || {};
    const { data: albums, loading, setData: setAlbums } = FetchAlbums(`albums?userId=${encodeURIComponent(userId)}`);

    if (loading) {
        return <div>Loading...</div>;
    }

    const filteredAlbums = albums.filter((album) => {
        const searchLower = search.toLowerCase();
        if (searchBy === 'title') {
            return album.title.toLowerCase().includes(searchLower);
        } else if (searchBy === 'serial') {
            return (albums.indexOf(album) + 1).toString().includes(searchLower);
        }
        return false;
    });

    const createNewAlbum = async (newAlbumTitle) => {
        try {
            const newAlbum = {
                userId: parseInt(userId),
                id: nextId.toString(),
                title: newAlbumTitle,
            };

            const response = await fetch('http://localhost:3500/albums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAlbum),
            });
            if (!response.ok) {
                throw new Error('Failed to create new album');
            }

            setAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
            setNextId(nextId + 1); // Incrémentation de l'ID pour le prochain album
            alert('Album created successfully!');
        } catch (error) {
            console.error('Error creating album:', error);
            alert('Failed to create album');
        }
    };

    const deleteAlbum = async (albumId) => {
        try {
            const response = await fetch(`http://localhost:3500/albums/${albumId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete album');
            }

            setAlbums((prevAlbums) => prevAlbums.filter(album => album.id !== albumId));
            alert('Album deleted successfully!');
        } catch (error) {
            console.error('Error deleting album:', error);
            alert('Failed to delete album');
        }
    };

    const handleCreateAlbum = (e) => {
        e.preventDefault();
        const newAlbumTitle = e.target.elements.albumTitle.value;
        createNewAlbum(newAlbumTitle);
        e.target.reset();
    };

    return (
        <div className='container_album'>
            <h1>Albums of {actualUser.username}</h1>

            <div>
                <label htmlFor="searchBy">Search by: </label>
                <select id="searchBy" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="serial">Serial Number</option>
                </select>
            </div>

            <SearchItem search={search} setSearch={setSearch} />

            <div className="albums-grid">
                {filteredAlbums.length > 0 ? (
                    filteredAlbums.map((album) => (
                        <div key={album.id} className="user-album">
                            <Link to={`/albums/${album.id}`}>
                                <p>Album #{album.id}: {album.title}</p>
                            </Link>
                            <button onClick={() => deleteAlbum(album.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>NO ALBUM FOUND.</p>
                )}
            </div>

            <form onSubmit={handleCreateAlbum}>
                <h2>Create New Album</h2>
                <input
                    type="text"
                    placeholder="Enter the title of album"
                    name="albumTitle"
                    required
                />
                <button type="submit">Create an Album</button>
            </form>
        </div>
    );
};

export default Albums;

