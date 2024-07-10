import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FetchAlbums from './FetchAlbums';
import SearchItem from './SearchItem';
import styles from '/src/styles/Albums.module.css';

const Albums = () => {
    const { userId } = useParams();
    const [search, setSearch] = useState('');
    const [searchBy, setSearchBy] = useState('title');
    const [nextId, setNextId] = useState(1);
    const actualUser = JSON.parse(localStorage.getItem('user')) || {};
    const { data: albums, loading, setData: setAlbums } = FetchAlbums(`albums?userId=${encodeURIComponent(userId)}`);
   
    useEffect(() => {
        if (albums.length > 0) {
            const maxId = Math.max(...albums.map(album => parseInt(album.id)));
            setNextId(maxId + 1);
        }
    }, [albums]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const filteredAlbums = albums.filter((album) => {
        const searchLower = search.toLowerCase();
        if (searchBy === 'title') {
            return album.title.toLowerCase().includes(searchLower);
        } else if (searchBy === 'serial') {
            return album.id.toString().includes(searchLower);
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

            setAlbums(prevAlbums => [...prevAlbums, newAlbum]);
            setNextId(nextId + 1);
            alert('Album created successfully!');
        } catch (error) {
            console.error('Error creating album:', error);
            alert('Failed to create album');
        }
    };

    const deleteAlbum = async (albumId) => {
        if (!window.confirm('Are you sure you want to delete this album?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3500/albums/${albumId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete album');
            }

            setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== albumId));
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
        <div className={styles.albumContainer}>
            <header>
                <h1>{actualUser.username}'s Albums</h1>
            </header>

            <div className={styles.formContainer}>
                <label htmlFor="searchBy">Search by: </label>
                <select id="searchBy" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="serial">Serial Number</option>
                </select>
                <SearchItem search={search} setSearch={setSearch} />
            </div>

            <div>
                <form onSubmit={handleCreateAlbum} className={styles.createForm}>
                    <h2>Create New Album</h2>
                    <input
                        type="text"
                        placeholder="Enter the title of album"
                        name="albumTitle"
                        required
                    />
                    <button type="submit" className={styles.buttonCreateAlbum}>Add</button>
                </form>
            </div>

            <div className={styles.albumsGrid}>
                {filteredAlbums.length > 0 ? (
                    filteredAlbums.map((album) => (
                        <div key={album.id} className={styles.selectedAlbum}>
                            <Link to={`/albums/${album.id}`}>
                                <p>Album {album.id}: {album.title}</p>
                            </Link>
                            <button onClick={() => deleteAlbum(album.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>NO ALBUM FOUND.</p>
                )}
            </div>
        </div>
    );
};

export default Albums;
