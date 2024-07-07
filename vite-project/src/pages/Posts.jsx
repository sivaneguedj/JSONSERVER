import { useParams } from "react-router-dom";
import { useState } from 'react';
import FetchAlbums from "./FetchAlbums";
import SearchPost from "./searchPost";
import styles from "/src/styles/Post.module.css";

const Posts = () => {
    const { userId } = useParams();
    const actualUser = JSON.parse(localStorage.getItem('user')) || {};
    const { data: posts, loading, setData: setPosts } = FetchAlbums(`posts?userId=${encodeURIComponent(userId)}`);
    const [searchByPost, setSearchByPost] = useState("title");
    const [nextId, setNextId] = useState(12);
    const [search,setSearch]=useState('');

    const fetchLastPostId = async () => {
        try {
            const response = await fetch(`http://localhost:3500/posts?_sort=id&_order=desc&_limit=1`);
            if (!response.ok) {
                throw new Error('Failed to fetch last post ID');
            }
            const lastPost = await response.json();
            
            if (lastPost.length === 0) {
                return 1;
            }
            
            const lastId = parseInt(lastPost[0].id, 10);
            return lastId + 1; 
        } catch (error) {
            console.error('Error fetching last post ID:', error);
            throw new Error('Failed to fetch last post ID');
        }
    };

  
    const createNewPost = async (newPostTitle, newPostBody) => {
        try {
            const newPostId = await fetchLastPostId(); 

            const newPost = {
                userId: parseInt(userId, 10),
                id: newPostId.toString(), 
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
            setNextId(newPostId + 1);
            alert('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        const newPostTitle = e.target.elements.postTitle.value;
        const newPostBody = e.target.elements.postBody.value;
        await createNewPost(newPostTitle, newPostBody);
    };

    return (
        <div className={styles.container_Posts}>
            <h1>Posts of {actualUser.username}</h1>
            <div>
                <label htmlFor="searchByPost">Search by: </label>
                <select id="searchByPost" value={searchByPost} onChange={(e) => setSearchByPost(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="serial">Serial Number</option>
                </select>
            </div>
            <SearchPost search={search} setSearch={setSearch} />

            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : (
                <div className={styles.postGrid}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className={styles.userPost}>
                                <h2>{post.title}</h2>
                                <p>{post.body}</p>
                            </div>
                        ))
                    ) : (
                        <div>No posts found.</div>
                    )}
                </div>
            )}
            <div>
                <form onSubmit={handleCreatePost} className={styles.form}>
                    <h2>Create a New Post</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        name="postTitle"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Body"
                        name="postBody"
                        required
                    />
                    <button type="submit">Create a Post</button>
                </form>
            </div>
        </div>
    );
};

export default Posts;
