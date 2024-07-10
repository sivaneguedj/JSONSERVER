import React, { useEffect, useState } from 'react';
import Fetch from '../fetch';
import styles from "../styles/Post.module.css";

const ListOfComments = ({ postId }) => {
    const { data: comments, loading, error, setData: setComments } = Fetch('comments/');
    const actualUser = JSON.parse(localStorage.getItem('user')) || {};

    const [newCommentBody, setNewCommentBody] = useState('');
    const [nextIdComment, setNextIdComment] = useState(1);
    const [editComment, setEditComment] = useState(null);

    useEffect(() => {
        const maxId = comments.reduce((maxId, comment) => Math.max(maxId, comment.id), 0);
        setNextIdComment(maxId + 1);
    }, [comments]);

    const API_URL = 'http://localhost:3500/comments';

    const createNewComment = async (newCommentBody) => {
        try {
            const newComment = {
                postId: parseInt(postId),
                id: nextIdComment.toString(),
                name: actualUser.name,
                email: actualUser.email,
                body: newCommentBody
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newComment),
            });

            if (!response.ok) {
                throw new Error('Failed to create new comment');
            }

            const createdComment = await response.json();
            setComments(prevComments => [...prevComments, createdComment]);
            setNextIdComment(nextIdComment + 1);
            alert('Comment created successfully!');
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Failed to create comment');
        }
    };

    const handleCreateComment = (e) => {
        e.preventDefault();
        createNewComment(newCommentBody);
        setNewCommentBody('');
    };

    const handleEditComment = (e) => {
        e.preventDefault();
        const updatedCommentBody = e.target.elements.editedCommentBody.value;
        handleEdit(editComment.id, updatedCommentBody);
        e.target.reset();
    };

    const handleEdit = async (id, updatedCommentBody) => {
        try {
            const updatedComment = {
                ...editComment,
                body: updatedCommentBody
            };

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedComment),
            });

            if (!response.ok) {
                throw new Error('Failed to update comment');
            }

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === id ? { ...comment, body: updatedCommentBody } : comment));
            setEditComment(null);
            alert('Comment updated successfully!');
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment');
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`${API_URL}/${commentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            alert('Comment deleted successfully!');
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    if (loading) {
        return <div>Charging comments...</div>;
    }

    const filteredComment = comments.filter(comment => Number(comment.postId) === Number(postId));

    if (error) {
        return <div>Error : {error.message}</div>;
    }

    return (
        <div className={styles.commentContainer}>
            <h3>Comments :</h3>
            <div className={styles.commentGrid}>
                {filteredComment.length === 0 ? (
                    <div>No comment yet.</div>
                ) : (
                    filteredComment.map((comment) => (
                        <div key={comment.id} className={styles.userComment}>
                            <p>ID du post : {comment.postId}</p>
                            <p>ID du commentaire : {comment.id}</p>
                            <p>Nom : {comment.name}</p>
                            <p>Email : {comment.email}</p>
                            <p>Contenu : {comment.body}</p>
                            {comment.email === actualUser.email && (
                                <>
                                    <button onClick={() => deleteComment(comment.id)}>Delete</button>
                                    <button onClick={() => setEditComment(comment)}>Edit</button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            {editComment && (
                <form onSubmit={handleEditComment} className={styles.editForm}>
                    <input
                        type="text"
                        name="editedCommentBody"
                        placeholder="Edit Body"
                        defaultValue={editComment.body}
                        required
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditComment(null)}>Cancel</button>
                </form>
            )}

            <form onSubmit={handleCreateComment} className={styles.createForm}>
                <input 
                    type="text" 
                    name="commentBody" 
                    placeholder="Body" 
                    value={newCommentBody} 
                    onChange={(e) => setNewCommentBody(e.target.value)} 
                    required 
                />
                <button type="submit" className={styles.buttonAddComment}>Add</button>
            </form>
        </div>
    );
};

export default ListOfComments;

