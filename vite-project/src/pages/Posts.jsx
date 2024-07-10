import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Fetch from '../fetch'; // Assuming Fetch is correctly imported
import SearchItemPost from './SearchItemPost'; // Assuming SearchItemPost is correctly imported
import ListOfComments from './ListOfComments';
import styles from "../styles/Post.module.css";

const Posts = () => {
    const { userId } = useParams();
    const actualUser = JSON.parse(localStorage.getItem('user')) || {};
    const { data: posts = [], loading, error, setData: setPosts } = Fetch('posts/');
    const [editPost, setEditPost] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [nextIdPost, setNextIdPost] = useState(1);
    const [searchBy, setSearchBy] = useState('title');

    useEffect(() => {
        const myMax = posts.reduce((maxId, post) => Math.max(maxId, post.id), 0);
        setNextIdPost(myMax + 1);
    }, [posts]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEditPost = (e) => {
        e.preventDefault();
        const postId = editPost.id;
        const updatePostTitle = e.target.elements.editedPostTitle.value;
        const updatePostBody = e.target.elements.editedPostBody.value;
        handleEdit(postId, updatePostTitle, updatePostBody);
        e.target.reset();
    };

    const handleEdit = async (id, updatePostTitle, updatePostBody) => {
        try {
            const updatedPost = {
                title: updatePostTitle,
                body: updatePostBody
            };

            const response = await fetch(`http://localhost:3500/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPost),
            });
            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === id ? { ...post, ...updatedPost } : post));
            setEditPost(null);
            alert('Post updated successfully!');
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        }
    };

    const filteredPosts = posts.filter((post) => {
        const searchLower = searchTerm.toLowerCase();
        if (searchBy === 'title') {
            return post.title.toLowerCase().includes(searchLower);
        } else if (searchBy === 'serial') {
            return post.id.toString().includes(searchLower);
        }
        return false;
    }).filter(post => post.userId === parseInt(userId)); // Filtrer par userId

    const toggleSelectPost = (postId) => {
        setSelectedPost(selectedPost === postId ? null : postId);
    };

    const createNewPost = async (newPostTitle, newPostBody) => {
        try {
            const newPost = {
                userId: parseInt(userId),
                id: nextIdPost.toString(),
                title: newPostTitle,
                body: newPostBody
            };
            const response = await fetch('http://localhost:3500/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });
            if (!response.ok) {
                throw new Error('Failed to create new post');
            }

            const createdPost = await response.json();
            setPosts(prevPosts => [...prevPosts, createdPost]);
            setNextIdPost(nextIdPost + 1);
            alert('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3500/posts/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            if (selectedPost === postId) {
                setSelectedPost(null);
            }
            alert('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const handleCreatePost = (e) => {
        e.preventDefault();
        const newPostTitle = e.target.elements.postTitle.value;
        const newPostBody = e.target.elements.postBody.value;
        createNewPost(newPostTitle, newPostBody);
        e.target.reset();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <div className={styles.postsContainer}>
                <header>
                    <h1>{actualUser.username}'s Posts</h1>
                </header>

                <div className={styles.formContainer}>
                    <label htmlFor="searchBy">Search by: </label>
                    <select id="searchBy" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                        <option value="title">Title</option>
                        <option value="serial">Serial Number</option>
                    </select>
                    <SearchItemPost
                        search={searchTerm}
                        setSearch={handleSearch}
                    />
                </div>


                <div>
                    <form onSubmit={handleCreatePost} className={styles.createForm}>
                        <input type="text" name="postTitle" placeholder="Title" required />
                        <input type="text" name="postBody" placeholder="Body" required />
                        <button type="submit" className={styles.buttonCreatePost}>Create Post</button>
                    </form>
                </div>
                {editPost && (
                    <form onSubmit={handleEditPost} className={styles.editForm}>
                        <p className={styles.editTitle}>Edit your Post:</p>
                        <input
                            type="text"
                            name="editedPostTitle"
                            placeholder="Edit Title"
                            defaultValue={editPost.title}
                            required
                        />
                        <input
                            type="text"
                            name="editedPostBody"
                            placeholder="Edit Body"
                            defaultValue={editPost.body}
                            required
                        />
                        <button type="submit" className={styles.saveButton}>Save</button>
                        <button type="button" className={styles.cancelButton} onClick={() => setEditPost(null)}>Cancel</button>
                    </form>
                )}
                <div className={styles.postGrid}>
                    {selectedPost ? (
                        <div key={selectedPost} className={styles.selectedPost}>
                            <h2>{posts.find(post => post.id === selectedPost)?.title}</h2>
                            <p><strong>User Id:</strong> {posts.find(post => post.id === selectedPost)?.userId}</p>
                            <p><strong>N° of post:</strong> {selectedPost}</p>
                            <p><strong>Title:</strong> {posts.find(post => post.id === selectedPost)?.title}</p>
                            <p>{posts.find(post => post.id === selectedPost)?.body}</p>
                            <ListOfComments postId={selectedPost} />
                            <button onClick={() => setSelectedPost(null)}>Back to Posts</button>
                        </div>
                    ) : (
                        filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className={styles.userPost}
                                    style={{ fontWeight: selectedPost === post.id ? 'bold' : 'normal' }}
                                >
                                    <h2>{index + 1}: {post.title}</h2>
                                    <p><strong>User Id:</strong> {post.userId}</p>
                                    <p><strong>N° of post:</strong> {post.id}</p>
                                    <p><strong>Title:</strong> {post.title}</p>
                                    <button onClick={() => setSelectedPost(post.id)}>Comments</button>
                                    <button onClick={() => setEditPost(post)}>Edit</button>
                                    <button onClick={() => toggleSelectPost(post.id)}>Select</button>
                                    <button onClick={() => deletePost(post.id)}>Delete</button>
                                </div>
                            ))
                        ) : (
                            <p>No posts found for this user.</p>
                        )
                    )}


                </div>

            </div>
        </>
    );
};

export default Posts;
