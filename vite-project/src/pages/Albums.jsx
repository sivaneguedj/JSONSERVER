import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Fetch from '../fetch';
import SearchItem from './SearchItem';

const Albums = () => {
    const { userId } = useParams(); //recup UserId de l'URL
    const [search, setSearch] = useState('');
    const [searchBy, setSearchBy] = useState('title'); 
    const [albumsKey, setAlbumsKey] = useState(Date.now()); // faire le refetch
    const { data: albums, loading } = Fetch(`albums?userId=${encodeURIComponent(userId)}`);// requette pour avoir les albums l'UserID
    const actualUser = JSON.parse(localStorage.getItem('user')) || {}; 

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
            const response = await fetch('http://localhost:3500/albums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    title: newAlbumTitle,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create new album');
            }
            alert('Album created successfully!');
            setAlbumsKey(Date.now()); 
        } catch (error) {
            console.error('Error creating album:', error);
            alert('Failed to create album');
        }
    };

    const handleCreateAlbum = (e) => {
        e.preventDefault();
        const newAlbumTitle = e.target.elements.albumTitle.value;
        createNewAlbum(newAlbumTitle);
    };

    return (
        <div>
           
            <h1>Albums of {actualUser.username}</h1>
            
     
            <div>
                <label htmlFor="searchBy">Search by: </label>
                <select id="searchBy" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="title">Titre</option>
                    <option value="serial">Serial Number</option>
                </select>
            </div>

            <SearchItem
                search={search}
                setSearch={setSearch}
            />
            
       
            <div className="albums-grid">
                {filteredAlbums.length > 0 ? (
                
                    filteredAlbums.map((album, index) => (
                        <a><div key={album.id} className="user-album">
                            <p>Album #{albums.indexOf(album) + 1}: {album.title}</p>
                        </div></a>
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
                <button type="submit">Create a Album</button>
            </form>
        </div>
    );
};

export default Albums;
